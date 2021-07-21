import React, {useRef} from "react";
import ReactDOM from "react-dom";
import {Editor, EditorState, RichUtils,convertFromRaw,convertToRaw} from "draft-js";
import Grid from "@material-ui/core/Grid";
import "draft-js/dist/Draft.css";
import './myeditor.css';

//모든 문서의 효과는 setEditorState로 세팅해야함.

function MyEditor() {
    const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());


    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return "handled";
        }

        return "not-handled";
    };

    const _toggleBlockType = (blockType) => {
        //console.log("prev state : "+JSON.stringify(editorState));
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
        //console.log("new state : "+JSON.stringify(editorState));
    };

    const _toggleInlineStyle = (inlineStyle) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const focuselement = useRef();
    const givefocus = () => focuselement.current.editor.focus();

    return (
        <Grid container>
            <Grid container item justify="center" xs={9}>
                <div className="RichEditor-root">


                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={_toggleBlockType}
                    />
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={_toggleInlineStyle}
                    />
                    <div className="RichEditor-editor" onClick={givefocus}>
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            handleKeyCommand={handleKeyCommand}
                            ref={focuselement}
                            blockStyleFn={getBlockStyle}
                            placeholder="start write"
                        />
                    </div>
                </div>
            </Grid>
            <Grid item xs={3}>
                toolbar



            </Grid>
        </Grid>
    );
}

const getBlockStyle = (block) => {
    switch (block.getType()) {
        case "blockquote":
            return "RichEditor-blockquote";
        default:
            return null;
    }
};

const StyleButton = (props) => {

    const onToggle = (e) => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    let className = "RichEditor-styleButton";
    if (props.active) {
        className += " RichEditor-activeButton";
    }

    return (
        <span className={className} onMouseDown={onToggle}>
        {props.label}
      </span>
    );

}

const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};


export default MyEditor;

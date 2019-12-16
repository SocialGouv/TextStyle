import React from "react";
import CKEditor from "ckeditor4-react";
import AddRevision from "./AddRevision";
import SelectRevision from "./SelectRevision";
import PropTypes from "prop-types";

export default class CkEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: props.readonly,
      article: props.article,
      articleRevision: props.article.article_revisions[
        props.article.article_revisions.length - 1
      ]
        ? props.article.article_revisions[
            props.article.article_revisions.length - 1
          ].text
        : props.article.texte,
      newText: ""
    };
    CKEditor.editorUrl = "/ckeditor/ckeditor.js";
    CKEditor.displayName = "Test";
  }

  handleToUpdate = someArg => {
    var myArticle = this.state.article.article_revisions.find(
      x => x.id == someArg
    );
    if (myArticle) {
      this.setState({
        articleRevision: myArticle.text
      });
    } else {
      alert("Aucun article ne correspond à l'ID " + someArg);
    }
  };

  render() {
    return (
      <div>
        <CKEditor
          onBeforeLoad={CKEDITOR => {
            CKEDITOR.disableAutoInline = true;
          }}
          readOnly={this.state.readOnly}
          config={{
            extraPlugins: "autogrow",
            removePlugins:
              "liststyle,tableselection,tabletools,tableresize,contextmenu"
          }}
          onDataReady={CKEDITOR => {
            var lite = CKEDITOR.editor.plugins.lite;
            lite &&
              lite
                .findPlugin(CKEDITOR.editor)
                .setUserInfo({ id: 1, name: "Hugo" });
          }}
          onChange={evt => {
            this.setState({
              newText: evt.editor.getData()
            });
          }}
          data={
            !this.state.readOnly
              ? this.state.articleRevision
              : this.state.article.texte
          }
        />
        {!this.state.readOnly ? (
          <AddRevision
            projet={this.state.article.project}
            article={this.state.article.id}
            text={this.state.newText}
            name="Hugo"
          />
        ) : (
          ""
        )}
        {!this.state.readOnly ? (
          <SelectRevision
            articleRevision={this.state.article.article_revisions}
            handleToUpdate={this.handleToUpdate}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

CkEditor.propTypes = {
  readonly: PropTypes.bool,
  article: PropTypes.object
};

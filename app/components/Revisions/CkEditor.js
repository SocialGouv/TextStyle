import React from "react";
import CKEditor from "ckeditor4-react";
import AddRevision from "./AddRevision";
import SelectRevision from "./SelectRevision";
import PropTypes from "prop-types";
import { getJwt } from "../../utils/auth";

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
      newText: "",
      userInfo: getJwt()
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
    const toolbar = !this.state.readOnly
      ? [["Undo", "Redo"], ["lite-rejectone"]]
      : [];
    return (
      <div>
        <CKEditor
          onConfigLoaded={e => {
            const configLoad = e;
            if (configLoad) {
              console.log(configLoad);
              const conf = configLoad.editor.config;
              const lt = (conf.lite = conf.lite || {});
              lt.userStyles = {
                1: 2,
                2: 2,
                3: 2,
                4: 2,
                5: 2
              };
            }
          }}
          onBeforeLoad={CKEDITOR => {
            CKEDITOR.disableAutoInline = true;
          }}
          readOnly={this.state.readOnly}
          config={{
            toolbar: toolbar,
            extraPlugins: "autogrow,lite",
            removePlugins:
              "liststyle,tableselection,tabletools,tableresize,contextmenu"
          }}
          onDataReady={CKEDITOR => {
            var lite = CKEDITOR.editor.plugins.lite;
            lite &&
              lite.findPlugin(CKEDITOR.editor).setUserInfo({
                id: this.state.userInfo.user.id,
                name:
                  this.state.userInfo.user.lastName +
                  " " +
                  this.state.userInfo.user.firstName
              });
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
            project={this.state.article.project}
            article={this.state.article.id}
            text={this.state.newText}
            name={
              this.state.userInfo.user.lastName +
              " " +
              this.state.userInfo.user.firstName
            }
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

import { createGlobalStyle } from "styled-components";

/* Adding all styling here globally so it's not distracting in the components
   for the purpose of this demo. I know this CSS is horrible,
   I'm just getting something working quick */

export default createGlobalStyle`
  /*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */button,hr,input{overflow:visible}progress,sub,sup{vertical-align:baseline}[type=checkbox],[type=radio],legend{box-sizing:border-box;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:ButtonText dotted 1px}fieldset{padding:.35em .75em .625em}legend{color:inherit;display:table;max-width:100%;white-space:normal}textarea{overflow:auto}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}
  a[aria-disabled='true'] {
    color: grey !important;
    pointer-events: none;
    opacity: 0.7;
  }

  * {
    font-family: Arial, Helvetica, sans-serif;
    box-sizing: border-box;
  }

  html {
    font-size: 10px;
  }

  body {
    background: #fbfbfd;
    font-family: 'Helvetica, sans-serif';
    text-align: center;
    margin-top: 50px;
  }

  .header {
    background: #ECEEE9;
    border-bottom: 1px solid #eaedf2;
    text-align: left;
    padding: 0 25px;
    position: fixed;
    width: 100%;
    top:0;
    left: 0;
    height: 50px;
    z-index: 1010;
    
    h1 {
      font-size: 20px;
      color: #3e3f42;

      a {
        color: #3e3f42;
        text-decoration: none;
      }
    }

    svg {
      position: relative;
      left: -5px;
      vertical-align: text-top;
    }
  }

  .fz-14px{
    font-size:14px;
  }

  .main {
    padding: 60px 30px;
    text-align: left; 
    max-width: 1180px;
    margin: 0 auto;

    header {
      margin-bottom: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      
      h2 {
        font-size: 26px;
        font-weight: lighter;
        color: #cccccc;
        margin-bottom: 0;
        text-align:left;
        strong{
        color:#777777;
        font-weight: 600;
        }
      }
     
      a {
        font-size: 14px;
        font-weight: bold;
        font-style: normal;
        color: #7b7b7b;
      }

      p {
        color: #9ea0a5;
        font-size: 1.4rem
      }

      .add-link {
        position: absolute;
        top: 25px;
        right: 0;
        font-size: 4rem;
        color: #272e5c;
        transition: 0.1s;

        &:hover {
          font-size: 4.2rem;
          right: -1px;
          top: 24px;
        }
      }
    }
    
  }

  .loading-items {
    height: 500px;
    display: flex;
    font-size: 1.8rem;
    align-items: center;
    justify-content: center;
  }

  .resultNumber{
    margin-top:20px;
    margin-bottom: 20px;
  }

  .searchBoxElastic{
    input{
      font-size:0.9em !important;
      background-color: hsl(0,0%,100%);
      border-color: hsl(0,0%,80%);
      border-radius: 4px;
      border-style: solid;
      border-width: 1px;
      border-radius: 2px;
      color: hsl(0,0%,20%);
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover{
        border-color: hsl(0,0%,70%);
      }
    }
    .search-icon,.cancel-icon{
      margin-top: -7px;
      fill: hsl(0,0%,60%) !important;
    }
  }

  .resultElastic {
    .list-item{
      border-color: #eaedf2;
    }
  }

  .btn{
    font-size: 15px;
  }

  .cke_bottom{
    display:none !important;
  }

  .basic-multi-select{
    outline: none !important;
    margin-bottom:20px;
    margin-top:20px;
    .select__multi-value__label,.select__placeholder{
      font-size:0.9em !important;
    }
  }

  
   .card-list{
     margin: 10px 0;
     border-radius: 10px;
     box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
     border: solid 1px #d6d6d6;
     background-color: #ffffff;
    
    & :first-letter {
        text-transform: uppercase;
        } 
        .card-header {
            border-radius: 10px;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
            background-color: #7b7b7b;
            color: #fff;
            font-size: 28px;
            padding: 20px 15px;
            &.custom-header{
            font-size:18px
            }
        }
        
        .card-body {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            text-align: justify;
            .card-text  {
                font-size: 18px;
                color: #7b7b7b;
            }
            .card-title {
                font-size: 16px;
                color: #7b7b7b;
              
            }
            p {
                color:#d6d6d6;
                font-size: 14px;
            }
            .card-actions{
            button {
            width:100%;
            margin:5px 0;
            padding:5px 10px;
            border-radius: 5px;
            border:  none;
            outline-color: transparent;
            outline: none !important;
                &.createButton{
                background:#e2eed8;
                }
                &.deleteButton{
                background:#efdfdf;
                }
                &.waitingButton{
                background:#fcf7e4;
                }
             }
            }
            .card-editors{
            width: 100%;}
        }
   }
   .form-group {
    margin-bottom: 5rem;
    font-size: 18px;
    }
    @media only screen and (max-width: 768px) {
    .card-body{
    flex-direction: column;
    }
    }

    .loading-title {
     -webkit-animation: fadeInOut 8s linear forwards;
        animation: fadeInOut 8s linear forwards;
        background: #fbfbfd;
        text-align: center;
        margin-top: 200px;
        font-size:50px;
        font-weight: lighter;
        color: #cccccc;
    }
    .loading-strong {
      text-align: center;
      color: #777777;
     }

    @keyframes fadeInOut {
      0%{
       transform: translate3d(0, -20%, 0);
       }
       25%{
       transform: translate3d(0, 0, 0);
       opacity: 1;
       }
       75% { 
       opacity: 1;
       }
       100%{
        opacity: 0;
       }
    }
    .visuallyMainHidden {
      visibility: hidden
    }
    .visuallyMain {
      visibility: visible
    }
    .visuallyHidden {
      display: none;
    }
    .numberArticle{
      font-size: 15px;
    }
    button.headerButton {
      padding:7px 15px;
      font-size: 15px;
      border-radius: 5px;
      border:  none;
      outline: none !important
      outline-color: transparent;
      &.createButton{
        background:#e2eed8;
        &:hover, &.onThisStatus{
          background: #5cb85c
        }
      }
      &.deleteButton{
        background:#efdfdf;
        &:hover, &.onThisStatus{
          background: #d9534f;
        }
      }
      &.waitingButton{
        background:#fcf7e4;
        &:hover, &.onThisStatus{
          background: #f0ad4e
        }
      }
      svg{
        margin-right: 3px;
        vertical-align: sub;
      } 
    }
`;

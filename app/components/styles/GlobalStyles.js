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
    background: #eff4fd;
    font-family: 'Helvetica, sans-serif';
    text-align: center;
    overflow-x: hidden;
  }
  .menu-img {
    margin: auto !important;
    margin-top: 2em !important;
    cursor:pointer;
    color: #fff;
    background: transparent;
    border: none;
    width: 37px;
    &:hover {
        transform: translateY(-2px);
        cursor:pointer;
        color: #fff;
        background: transparent;
        border: none;
        box-shadow: none;
      
     }
     &:active {
        color: #000 !important; 
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
     }
   
    &.activeRoute {
        background:white;
        color: #000;
        border: none;
     }
     
   }


hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border: 0;
    border-top: 2px solid rgba(255, 255, 255, 0.87);
    width: 100%;
    position: absolute;
    left: 0;
}

  .header {
    border-bottom: 1px solid #eaedf2;
    position: fixed;
    padding-right: 15px !important;
    width: 100%;
    max-width: 25%;
    top:0;
    left: 0;
    height:100%
    align-items: center;
    display: flex;
    flex-direction: column;
    z-index: 1010;
    .header-menu{
     background: #16365a;
     height:inherit;
     width:100%
     display: flex;
     flex-direction: column;
     padding: 0;
     .logo-container {
         background: white;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin: auto;
        cursor:pointer;
     }
     
     
    }
    h1 {
      font-size: 20px;
      color: #3e3f42;

      a {
        color: #3e3f42;
        text-decoration: none;
      }
    }

    button{
      margin: .67em 0;
    }
  }

  .fz-14px{
    font-size:14px;
  }
  .hasHeader{
  margin:auto;
  }

  .main {
    padding: 60px 30px;
    text-align: left; 
  
   
    header {
      margin-bottom: 30px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: end;
      
      h2 {
        font-family: HelveticaNeue;
         font-weight: bold;
         color: #08131f;
         font-size: 22px;
        strong{
        color:#777777;
        font-weight: 600;
        }
      }
     
      a {
        font-size: 14px;
        font-weight: bold;
        color: #7b7b7b;
      }

      p {
        color: #9ea0a5;
        font-size: 1.4rem
      }
     
    }
    
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
         
 .login {
     h2 {
      text-align: center;
       font-size: 50px;
       color: #245a96;
        margin-bottom: 100px;
      }
      .alert-danger {
          max-width: 500px;
          margin: 0 auto;
        }
   }
  .card-login {
      max-width: 500px;
      margin: 0 auto;
      border:3px solid #245a96;
      border-radius: 10px;
      .card-header {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
        background-color: #245a96;
        color: #fff;
        font-size: 28px;
        padding: 20px 15px;
        text-align: center;
        }
            .btn-login {
              background-color: #245a96;
              border-color:#245a96;
              color: #fff;
              width: 110px;
              margin: 0 auto;
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
            background-color: #245a96;
            color: #fff;
            font-size: 20px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            padding: 10px;
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
                color: #7b7b7b;
                font-size: 15px;
                display: inline-block;
                padding: 0px;
                font-family: Roboto;
            }
            .card-title {
                font-size: 16px;
                color: #000000;
                font-family: Roboto;
            }
            p {
                color: #7b7b7b;
                font-size: 15px;
                font-weight: 100;
            }
            .card-actions{
            button {
            width:100%;
            margin:5px 0;
            padding:5px 10px;
            border-radius: 5px !important;;
            border:  none;
            outline-color: transparent;
            outline: none !important;
            background: #fff !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                &.createButton{
                color: #60c77c;
                }
                &.deleteButton{
                color: #c76060;
                }
                &.waitingButton{
                color: #eacf5e;
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
    .visual-main-hidden {
      visibility: hidden
    }
    .visual-main {
      visibility: visible
    }
    .visual-hidden {
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
      border-radius: 10px !important;
      background: #fff !important;
      font-weight: bold;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
      
      &.createButton{ 
        color: #60c77c;
        margin-right: 15px;
        &:hover, &.onThisStatus{
          background: #60c77c !important;
          color: #fff !important;
        }
      }
      &.deleteButton{
        color: #c76060;
        &:hover, &.onThisStatus{
          background: #c76060 !important;
          color: #fff !important;
        }
      }
      &.waitingButton{
        color: #eacf5e;
        margin-right: 15px;
        &:hover, &.onThisStatus{
          background: #eacf5e !important;
          color: #fff !important;
        }
      }
      svg{
        margin-right: 3px;
        vertical-align: sub;
      } 
    }
     .add-input {
          border-radius: 4px;
          border: solid 1px #dddddd;
          background-color: #dddddd;
          color:#373a3c;
          width: 180px;
        }
        h1 {
          font-family: HelveticaNeue;
          font-weight: bold;
          color: #373a3c;
          font-size: 26px;
        }
        .btn-add-member{
          background: transparent;
          border-color: transparent;
          img {
            padding: 1em;
            border: 1px dashed #ddd;
          }
        }
         .add-project {
          border-radius: 4px;
          border: solid 1px #dddddd;
          background-color: #dddddd;
          text-align: center;
          width: auto;
          color: #373a3c;
             &.custom {
             width: 100px;
            }
            &.disabled {
              cursor: not-allowed;
              opacity: 0.3;
              filter: alpha(opacity=65);
              -webkit-box-shadow: none;
              box-shadow: none;
             
            }
        }
        .add-member-modal {
            
            max-width: 1140px;
            margin: 0 auto;
            .home {
              text-align: left;
              padding: 0;
            }
            .modal-content {
            border: 1px solid #dddddd;
            border-radius: 10px;
            }
       }
            button.close{
                background: initial;
                border-radius: 0;
                padding: 3px 7px;
                margin: 0;
            }
             .modal-header {
                background-color: #dddddd;
                border-radius: 0;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
        
             .modal-title{
                font-weight: 700;
                font-size: 2.5em;
               }
              button.close {
                background: transparent;
                border-radius: 50%;
                line-height: 10px;
                padding: 1rem 1rem;
                margin: 0;
                color: #fff;
                }
        
              }
  
            .modal-footer {    
                 border-top: none;
                justify-content: center; 
                border-radius: 0;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                display:block;
                }
    
            .rbt-input{
                text-align:left;
                width: 100%;
                font-size: 1.2rem;
               
                }
        }
     
       .home {
         h5 {
            color: #777777;
          
          &:first-child:after {
            content: "  -  ";
            white-space: pre;
            position: relative;
            line-height: 1;
            width: 100%;
          }
          }
       }
     .fa-search{
         position: absolute;
        right: 15px;
        top: 11px;
        line-height: 1.2;
        border-left: 1px solid #ced4da;
        color: #2880b9;
        width: 1em;
        padding: 0.15em 0;
        padding-left: 0.1em;
    }
        .btn-toolbar {
        width: 50px;
        height: 50px;
           }
     .img-person {
          width: 100%;
      }
      @media only screen and (max-width: 768px) {
   
     .add-member-modal {
              h3, h5 {
              width: 130px;
              white-space: nowrap;
              overflow: hidden;
              display: inline-block;
              text-overflow: ellipsis;
              margin: 0;
               }
       }}
    }
     th{
      font-family: HelveticaNeue;
      font-size: 16px;
      font-weight: bold;
    }
    td{
      font-family: HelveticaNeue;
      font-size: 16px;
      border-top: 1px solid #dddddd;
      text-align:left;
      width:20%
    }
    .responsiveTable tr td:last-child {
    text-align:end;
    }
    .buttonRight{
      float: right;
      font-family: HelveticaNeue;
      font-size: 16px;
      border-radius: 4px;
      border: solid 1px #dddddd;
      background-color: #dddddd;
      color: #373a3c;
      position:absolute;
      right:0;
    }
    .buttonLeft{
      float: left;
      font-family: HelveticaNeue;
      font-size: 16px;
      border-radius: 4px;
      border: solid 1px #dddddd;
      background-color: #dddddd;
      color: #373a3c;
      padding: 5px;
    }
    .hoverLinkRed{
      color: #d9534f;
    }
    .modal-header {
      background-color: #16365a;
      color: white;
    }
    .titreHeader{
      font-family: HelveticaNeue;
      font-size: 32px;
      font-weight: bold;
      line-height: 1.22;
      text-align: left;
      color: #000000;
    }
    .titreHeaderName{
      color: #777777;
    }
    button.close:focus {
    outline: none !important;
    }
  .modal-footer {
    justify-content: center!important;
    border-top: 0!important;
  }
  .contentModalDroit{
      width: 220px;
      height: 258px;
      border: dashed 2px #dddddd;
  }
  .activeSelect{
    border: dashed 2px #5cb85c!important;
  }
  .RectangleModalDroit {
    width: 108px;
    height: 108px;
    background-color: #dddddd;
    margin : 1em auto;
  }
  .close {
    font-size: 2.5rem!important;
  }
  .selectBlocTitle {
    font-family: HelveticaNeue;
    font-size: 16px;
    text-align: center;
    color: #373a3c;
  }
  div .modal-body a:hover {
    color: black!important;
    text-decoration: unset!important;
  }
  .descBloc{
    color: #777777;
    font-family: HelveticaNeue;
    font-size: 16px;
  }
  .modal-body {
    margin-right: 20px;
    margin-left: 20px;
  }
  .modal-content{
  border-radius: 1em;
  }
  .btn-link:hover , .btn-link:focus {
    text-decoration: none !important;
}
    h1 {
        font-family: HelveticaNeue;
        font-weight: bold;
        color: #777777;
        font-size: 26px;
    }
    .btn-light.disabled {
        cursor: not-allowed;
        opacity: 0.3;
        filter: alpha(opacity=65);
        -webkit-box-shadow: none;
        box-shadow: none;
    }
     .rbt-token-remove-button{
        padding: 0 4px !important;
        }
     .card-container {
          border: none;
          border-radius: 2em;
          margin: 2em;
          .profil-image {
            background-color: #ffe6cd;
            border-radius: 33px;
            img{
            padding-top: 20px;
            }

          }
          &.notif {
          .card-text {
            height: 100%;
            .row {
            height: 100%;
            img {
            height: 100%;
            }
            }
            }
          }
      }
      .buttonHome {
         background: #eff4fd;
         border: none;
         .menu-img {
            margin: auto !important;
            cursor:pointer;
            color: #fff;
            background: transparent;
            border: none;
    }
      }
     
      .card-actions{
            button {
            width:100%;
            margin:5px 0;
            padding:5px 10px;
            border-radius: 5px !important;;
            border:  none;
            outline-color: transparent;
            outline: none !important;
            background: #fff !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
            width: 50px;
            height: 50px;
                &.createButton{
                color: #60c77c;
                }
                &.deleteButton{
                color: #c76060;
                }
                &.waitingButton{
                color: #eacf5e;
                }
             }
            }
            .card-editors{
            width: 100%;}
        }
   }
  .modal-open{
      padding-right: 0 !important;
      overflow-y: auto !important;
    }
    @media only screen and (min-width: 768px) {
      .header{
        max-width: 16.666667%;
      }
    }
    @media only screen and (min-width: 992px) {
      .header{
        max-width: 8.333333%;
      }
    }
     .user-comment{
    border: 1px solid #245a96;
    border-radius: 50%;
    }
   
    .comment-sender {
      opacity: 1;
      border-radius: 5px;
      background-color: #87b0de;
      width: 100%;
      p {
      color: #000;
      padding: 5px;
      margin: 0;
    }
    }
    &.hasChild::after {
      position: absolute;
      content: " ";
      display: block;
      height: 180px;
      border-left: 1px solid #87b0de;
      width: 100%;
      top: 35px;
      z-index: 1;
    }
    .comment-reciv {
    .user-comment{
    border: 1px solid #ebc08c;
    border-radius: 50%;
    }
    .shadow {
    border-radius: 5px;
    background-color: #ebc08cba;
    width: 100%
    
    p {
      color: #000;
      padding: 5px;
      margin: 0;
    }
    }
    .hasChild::after {
      position: absolute;
      content: " ";
      display: block;
      height: 180px;
      border-left: 1px solid #ebc08cba;;
      width: 100%;
      z-index: 1;
    }
    }
    .comment-footer { 
      z-index: 2;
      position: relative;
    p {
    color: #9ea0a2 !important;
    }
    img {
    cursor: pointer;
    }
    }
    .bg-white {
        border-radius: 10px;
        textarea {
            border : none !important;
            box-shadow: none !important;
            font-size: 14px;
            }
    }
    .comment-list{
    position: fixed;
    height: 100%;
    max-width: inherit;
    font-size: 14px;
    @media only screen and (max-width: 768px) {
              position: relative;
          }
        .comment-list-container{
          font-size: 14px;
          overflow-y: auto;
          height: 65%;
          overflow-x: hidden;
          padding-left: 0;
          @media only screen and (max-width: 768px) {
              position: relative;
          }
         
        }
         button {
            border-radius: 5px; 
            background-color: #245a96;
            color: #fff;
        }
        .btn-close-comment {
            border-radius: 50%;
            width: 30px;
            height: 30px;
            background: #245a96;
            border: 1px solid #245a96;
            line-height: 0;
            padding: 0;
             }
         .img-update {
            cursor: pointer;
            z-index: 2;
         }
        }
    .textTest{
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid black;
    }
    .text-indicator-blue {
      width: 2px;
      height: calc(100% - 110px);
      position: absolute;
      background: #245a96;
      margin-top: 90px;
      margin-left: 20px;
  }
  .text-section{
    padding-left:35px;
    margin-top:15px;
    position: relative;
  }
  .text-section-indicator {
    width: 2px;
    height: calc(100% - 45px);
    position: absolute;
    background: #7b7b7b;
    margin-top: 45px;
    margin-left: 20px;
}
.text-article{
  padding-left: 40px !important;
}
`;

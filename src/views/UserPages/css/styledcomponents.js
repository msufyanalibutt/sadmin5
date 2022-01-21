import { from } from "apollo-boost";
import styled, { createGlobalStyle } from "styled-components";
import ChatBgImg from '../../../assets//img/chat-bg.png';
import ChatBgImg1 from "../../../assets/img/no-conversation.jpg";
import Modal from "react-modal";
import Downarrow from '../../../assets/img/select-icon.png'
import tickImg from '../../../assets/img/tick.png'
import Leftarrow from '../../../assets/img/svgarr2.png'
import Rightarrow from '../../../assets/img/svgarr.png'
import './style.css'

// Global style

export const GlobalStyle = createGlobalStyle`  
    /* @import url("./style.css"); */
    html{
        height:100%;
    }
    body{   
        font-family: var(--theme-fontfamily);
        background-color: #ffffff !important;
        height: 100%;
    }
    .highlight .resfilte button svg{        
        fill: var(--theme-color) !important;
    }
    .inner_page{
        text-align: left !important;
    }
    .txt_center{
        text-align: center;
    }
    img{
        max-width: 100%;
        cursor: pointer;
    }
    button:focus{
        outline: none!important; 
    }
    a{
        text-decoration: none;
        cursor: pointer;
    }
    ul{
        margin: 0;
        padding: 0;
        list-style: none;
    }
    button{
        border: none;
        background: #fff;
    }
    button:focus{
        outline: none;
    }
    .nn_cancel_btn.nn_cancel_ok{
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        font-size: 16px;
        font-weight: 500;
        padding: 8px 30px;
        border-radius: 3px;
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .paymentwrapper{
        text-align: center;        
    }
    .paymentwrapper ul li{
        display: inline-block;
        padding: 1em;
    }
    .noopacvluw{
        float: right;
    }
    .Errormessag{
        color: #f44336 !important;
        font-size: 12px;
    }
    .vote_card_hover.active{
        color:pink;
    }
    button.btn.toggled{
        color: var(--subtheme-color);
    }
    ::-webkit-scrollbar {
        -webkit-appearance: none;
    }
    ::-webkit-scrollbar:vertical {
        width: 8px;
    }
    ::-webkit-scrollbar:horizontal {
        height: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        border: 2px solid #dee2e6;
    }
    ::-webkit-scrollbar-track {
        border-radius: 5px;
        background-color: #dee2e6;
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
    .scrollDisable{
        overflow: hidden !important;
    }
    .bwXZIf{
        margin-bottom: 24px;
    }
    .msgg > div:first-child {
        text-align: center;
    }
    .msgg{
        display: table;
        width: 100%;
    }
    .msgg > div {
        display: table-cell;
        vertical-align: middle;
    }
    .msgg > div:last-child {
        padding: 0 0 0 10px;
    }      
    .rm_align {
        justify-content: start !important;
    }
    path.toggled{
        color: var(--subtheme-color)
    }
    .toggled > svg {
        fill:var(--theme-color) !important;
    }
    button[class*=" jss"]:focus{
        box-shadow: none
    }      
    .input-range__track--active{
        background-color: var(--theme-color);
    }
    .input-range__slider {
        background: var(--theme-color);
        border: 1px solid var(--theme-color);        
    }   
    .nn_seller_input .input-range__slider{
        margin-top: -15px;
    }
    .Toastify__toast-container--bottom-center {
        margin-left: -225px;
    }
    .Toastify__toast-container {
        width: 450px;
    }
    .Toastify__close-button{
        opacity: 0;
    }
    .Toastify__progress-bar.Toastify__progress-bar--animated.Toastify__progress-bar--success{
        background: transparent;
    }
    .ReactModal__Content.ReactModal__Content--after-open.slide-pane.slide-pane_from_right.some-custom-class{
        position: fixed;
        right: 0;
        top: 0!important;
        max-width: 500px;
    }
    .ReactModal__Content.ReactModal__Content--after-open.payrtl{
        /* overflow-y: scroll!important; */
        -webkit-overflow-scrolling: touch;
        margin-right: 0%;
    }
    /* .ReactModal__Content.ReactModal__Content--after-open.slide-pane.slide-pane_from_right.some-custom-class{
        height: 100%!important;
        margin-right: 0px;
    } */
    .ReactModal__Overlay.ReactModal__Overlay--after-open {
        background-color:rgba(0,0,0,0.5)!important;
        z-index: 100; /*rizz css */
    }
    body.ReactModal__Body--open .slick-list
    {
        height:500px;
    }
    .button.toggled{
        color:var(--theme-color);
    }
    .ReactModal__Body--open
    {
        overflow:hidden !important;
    }
    .ReactModal__Overlay.ReactModal__Overlay--after-open.Overlayss{
        position: fixed!important;
        top:0px!important;
        width:100%;
    }
    .ReactModalPortal .slide-pane__header{
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
        border:none!important;
        background: none!important;
    }
    .ReactModalPortal .slide-pane__close{
        margin-left: -11px;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.12) 0px 2px 4px 0px;
        border-radius: 50%;
        background-color: #fff;
        width: 40px;
        height: 40px;
        opacity: 1;
        padding: 7px 0;
        text-align: center;
        margin-top: -4px;
    }
    .slide-pane__close svg {
        width: 24px!important;
        padding: 0;
        fill: rgb(189, 189, 189);
    }
    .slide-pane .slide-pane__title{
        font-size:24px!important;
        font-weight: bold!important;
    }
    .slide-pane__title-wrapper {
        margin-left: 10px;
    }
    /* .slide-pane__content label{
        display: flex;
        font-weight: 500;
        font-size: 16px;
    } */
    .slide-pane__content{
        padding:0px!important;
    }
    .slide-pane__header > .slide-pane__close {
        background: none;
        box-shadow: none;
    }
    .Toastify__toast--success {
        opacity: .8!important;
        background: #000!important;
        border-radius: 10px;
        font-size: 14px
    }
    .msgg {
        display: table;
        width: 100%; 
    }
    .msgg>div {
        display: table-cell;
        vertical-align: middle;
    }
    .StripeElement {
        box-sizing: border-box;
        height: 40px;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }
    .StripeElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }
    .StripeElement--invalid {
        border-color: #fa755a;
    }
    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
    .nn_password::after{
        border-color: var(--theme-color) !important;
    }
    @media (min-width: 992px){
        .ReactModal__Content.ReactModal__Content--after-open{
            max-width: 500px;
            margin: 0 auto;
            bottom: auto !important;
            border: none !important;
            /* width: auto !important; */
        }
        .ReactModal__Overlay.ReactModal__Overlay--after-open {
            background-color:rgba(0,0,0,0.5)!important;
            z-index: 100; /*rizz css */
        }
        .ReactModalPortal .slide-pane__overlay{
            z-index: 99; /*rizz css */
        }
    }
    @media (min-width: 1024px)  {
        body.ReactModal__Body--open{
            overflow-y: hidden!important;
        }
    }
    @media screen and (max-width: 991px){   
        .ReactModal__Content.ReactModal__Content--after-open.slide-pane.slide-pane_from_right.some-custom-class{
            width: 100% !important;            
            /* max-width: 100% !important; */
        }
        /* .ReactModal__Content.ReactModal__Content--after-open {
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
        } */
        .ReactModalPortal .slide-pane__close{
            margin-left: 5px !important;
        }
        .ReactModal__Overlay.ReactModal__Overlay--after-open {
            background-color:rgba(0,0,0,0.5)!important;
            z-index: 100; /*rizz css */
        }
        .ReactModalPortal .slide-pane__overlay{
            z-index: 99; /*rizz css */
        }
    }
    @media screen and (max-width: 767px){         
        .input-range__track{
            height: 6px !important;
        }
        .ReactModalPortal .slide-pane__close{
            margin-left: 5px !important;
        }     
        .Toastify__toast-container {
            width: 100%;
            /* left: 80%; */
        }      
        .Toastify__toast-container--bottom-center {
            margin-left: 0px;
        } 
        body.ReactModal__Body--open .slick-list {
            height: 250px !important;
        }
    }
    .cls_round img
    {
        border-radius: 100px;
        height: 70px;
        width: 70px;
        object-fit: cover;
    }
`;

// Main

export const Main = styled.div`
    .AtavF {
        height: 64px;
        display: none;
    }   
    .enEXqW{
        box-sizing: border-box;
        position: fixed;
        display: flex;
        top: 0px;
        width: 100%;
        height: 64px;
        box-shadow: rgb(182, 182, 182) 0px -0.5px 0px 0px inset;
        background-color: var(--theme-color);
        min-width: 320px;
        z-index: 99;
        flex-flow: row nowrap;
        padding: 8px;
    }
    .hqhhAk {
        box-sizing: border-box;
        align-self: center;
        min-width: 32px;
        min-height: 32px;
        object-fit: contain;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        flex: 0 0 auto;
        padding: 0px 8px 0px 0px;
    }
    .hRKplV {
        width: 100vw;
        display: flex;
    }
    .hXHgcm {
        box-sizing: border-box;
        align-self: center;
        font-size: 12px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 16px;
        letter-spacing: normal;
        color: rgb(255, 255, 255);
        -webkit-box-align: center;
        align-items: center;
        display: flex;
        flex: 1 1 0%;
        padding: 0px;
    }
    .cfjxVa {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        width: 70px;
        height: 32px;
        font-size: 14px;
        line-height: 16px;
        font-weight: bold;
        color: var(--subtheme-color);
        align-self: center;
        cursor: pointer;
        margin-left: 5px;
    }
    .gSnPVw {
        height: 100%;
        width: 80px;
        right: 0px;
        top: 0px;
        position: absolute;
        z-index: -1;
    }
    .hmzaZs {
        height: 64px;
        width: 130px;
        position: absolute;
        right: 0px;
    }
    .gmsWds {
        width: 150px;
        height: 64px;
        position: absolute;
        right:-65px;
    }
    .dFLsJo {
        position: absolute;
        z-index: -1;
    }
    .resnoban{
        width:45%;
    }
    .resnoban, .loginRight{
        display: table-cell;
        vertical-align: top;
    }    
    .nn_categorylist{
        display: flex;
        background: var(--theme-color);
        padding: 0px 0px;        
    }
    .nn_categorylistname{
        position: relative;
    }
    .nn_categorylist.active{
        padding: 0px 60px 0px 20px;
    }
    .cls_licount {
        display: flex;
        overflow-x: auto;
        white-space: nowrap;
        width: 100%;
        align-items: center;
        scroll-behavior: smooth;
        overflow-x: auto;
        -ms-overflow-style: none;
        scrollbar-width: none !important;
        position: relative;
        &.nn_licount{
            /* justify-content: center; */
        }
        &.nn_licount1{
            justify-content: start;
        }
    }
    .cls_licount::-webkit-scrollbar {
        -webkit-appearance: none !important;
        display: none !important;
    }
    .cls_licount::-moz-scrollbars {
        display: none !important;
    }
    .cls_licount .opLow {
        opacity: .35 !important;
    }
    .nn_categorylist.hidden .cls_licount{
        padding: 0px 10px 0 25px;
        /* justify-content: center; */
    }   
    .nn_categorylist.active .cls_licount{
        justify-content: start;      
        padding: 0px 30px;
    }
    .nn_categorylist.hidden .cls_licount.nn_licount{    
        justify-content: center;
    }
    .nn_categorylist.hidden .cls_licount.nn_licount1{    
        justify-content: start;
    }
    .nn_categorylist.active .nn_btn.hidden,.nn_categorylistname.active .nn_categorylist.hidden .nn_btn.cls_right.active,
    .nn_categorylistname.hidden .nn_btn.cls_right.hidden,.nn_categorylist.active .nn_btn.cls_right.hidden{
        display: flex;
    }
    .nn_btn.hidden,.nn_categorylistname.hidden .nn_categorylist.hidden .nn_btn.cls_left.active,.nn_categorylistname.hidden .nn_categorylist.hidden .nn_btn.cls_right.hidden {
        display: none;
    }
    .nn_btn.cls_left.hidden{
        display: none;
    }
    .nn_categorylist.active .cls_licount{
        justify-content: start;
    }
    .nn_catealign{
        padding: 15px 12px;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }   
    .nn_categorylist.active .cls_licount.nn_licount1 .nn_selectCate.nn_catealign,.cls_licount.nn_licount1 .nn_selectCate.nn_catealign{
        position: fixed;
        left: 50% !important;
        z-index: 99;
        background: var(--theme-color);
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        width: 100%;
    }
    .cls_licount.nn_licount .nn_selectCate.nn_catealign{
        position: unset;
        left: unset;
        background: transparent;
        transform: unset;
    }
    .nn_categoryctn {
        height: 50px;
        width: 50px;
        display: inline-block;
        position: relative;
    }
    .nn_categoryctn a{
        color: #fff;
    }
    .nn_categoryctn a .cateimg{
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #fff;
        border-radius: 50px;
        border: 1px solid #000;
    }
    .nn_categoryctn .closecate{
        position: absolute;
        top: -10px;
        right: -7px;
    }
    .nn_catetitle{
        color: var(--subtheme-color) !important;
        text-decoration: none; 
        font-size: 17px;
        font-weight: 600;
        margin-left: 10px;
    }
    .nn_btn {
        background: var(--theme-color);
        position:absolute;
        padding: 14px 0px;
    }
    .nn_btn.cls_left
    {
        left:0;
    }
    .nn_btn.cls_right
    {
        right:0;
    }   
    .nn_btn .nn_catebtn{
        background: transparent;
        border: none;
        color: var(--subtheme-color);
    }
    .nn_btn .nn_catebtn:focus{
        outline: none;
    }
    .nn_btn .nn_catebtn .icon{
        font-size: 50px;
    }  
    .cls_cate_mbl,.nn_categorylist.hidden .nn_btn.cls_left.hidden,.nn_categorylist.hidden .nn_btn.cls_right.active{
        display: none;
    }
    .closecate{
        position: absolute;
        top: 0px;
        left: 30px;
    }    
    .nn_categoryHide{
        display: none;
    }
    @media screen and (min-width: 992px){
        .nn_category{
            margin-top: 85px;
            position: fixed;
            top: 0;
            z-index: 10;
            left: 0;
            right: 0;
        }        
    }
    @media screen and (min-width: 1600px){
        .cls_licount{
            justify-content: center;
        }
    }
    @media screen and (max-width: 991px){                                   
        .nn_category,.overallpaddpp .cls_cate_mbl{
            display: none;
        }
        .overall-filt{
            box-shadow: none!important;
            margin-top:0px;
        }     
        .cls_licount.nn_licount1 .nn_selectCate.nn_catealign{
            position: absolute;
            left: 50%;
            z-index: 99;
            background: var(--theme-color);
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            width: 100%;
        }
        .cls_licount.nn_licount .nn_selectCate.nn_catealign{
            position: unset;
            left: unset;
            background: transparent;
            transform: unset;
        }   
    }       
    @media screen and (max-width: 767px){
        .AtavF{
            display: block!important;
        }
        .topbannev #hdrFx{
            top:60px;
        }          
        .cls_licount{
            display: none;
            white-space: unset;
            padding: 10px 0px;
        }
        .nn_catealign{
            padding: 8px 0px;
            display: inline-block;
            width: calc(100% / 2);
            white-space: unset;
            text-align: center;
        }
        .nn_categoryctn{
            display: block;
            margin: 0 auto;
        }
        .nn_catetitle{
            margin-left: 0px;
        }
        .nn_categorylist .nn_btn,.nn_categorylist.active .nn_btn.hidden{
            display: none;
        }     
        .cls_filmodal  .popfilltegh{
            height: 100%;
            padding-bottom: 30px;
        }
        .cls_filmodal .border-btm {
            border-bottom: 1px solid #dee2e6;
            padding: 8px;
        }
        .cls_filmodal{
            position: fixed;
        }
        .cls_filmodal  .overallpaddpp{
            overflow-x:auto !important;
            -webkit-overflow-scrolling: touch; 
            height: 100%;
        }              
    }
`;

// Header
export const Headermain = styled.div`
    .headermain{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.12);
        /* transition: .3s;
        position: absolute;
        top: 0; */
        position: relative;
        position: fixed;
        top: 0;        
        /* -moz-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease; */
        transition: all 0.5s ease;
        z-index: 99;
    }
    .headerleft,.headerright{
        display: flex;
        align-items: center;
    }
    .headerleft .logo{
        margin-right: 16px;
        height: 64px;
        width:100px;
    }
    .headerleft .logo .logoimg{
        width: 100%;
        height: 100%;
        object-fit:contain;
    }
   .headerleft .searchfield{
        display: flex;
        border:1px solid rgb(148, 148, 148);
        border-radius: 20px;
        position: relative;
        width: 43%;
        margin-right: 10px;        
    }   
    .headerleft .searchfield .searchctn{
        position: relative;
        display: flex;
        width:100%;        
    }
    .headerleft .searchfield .searchctn .searchicon{
        margin: 4px 0px 0px 10px;
        color: rgb(148, 148, 148);
        fill: rgb(148, 148, 148);
        width: 24px;
        height: 24px;
    }
    .headerleft .searchfield .searchctn .searchinput{
        background-color: transparent;
        padding: 0px 35px 0 5px;
        width: 100%;
        border-radius: 2px;
        border: none;
        height: 35px;
        color: rgb(97, 97, 97);
        overflow: visible;
    }
    .headerleft .searchfield .searchctn{       
        img{
            display: none;
        }
        .nn_locationDropdown{
            padding: 0.5em 1em;
            &:hover{
                background: var(--theme-color-hvr);
                color: #fff;
                font-weight: 800;
            }
        }
        .searchinput + div{
            box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.09);
            margin-top: 5px;
            background: #fff;
        }
    }
    .headerleft .searchfield .searchinput:focus{
        outline: none;
    }
    .headerleft .searchfield .closeicon{
        position: absolute;
        right: 0px;
        background-color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 24px;
        border: none;
        padding: 0px;  
        margin-right: 10px;
        margin-top: 7px; 
    }
    .headerleft .searchfield .closeicon svg{
        width: 14px;
        height: 14px;
        fill: var(--theme-color);
        margin-top: -4px;
    }   
    .headerleft .nn_mob_searchbox .nn_locIcon{
        fill: rgb(148, 148, 148);
    }
    .headerright{
        justify-content: flex-end;
    }
    .headerright .login .loginbtn {
        color: var(--theme-color);
        background: #fff;
        border: 1px solid var(--theme-color);
        padding: 8px 18px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 32px;
        text-transform: capitalize;
        margin-right: 12px;
    }
    .headerright .login .loginbtn:hover {
        color: var(--subtheme-color);
        background: var(--theme-color);
    }
    .headerright .login .loginbtn:focus{
        box-shadow: none;
    }
    .headerright .ressell .sellstuffbtn{
        color: var(--subtheme-color);
        background:var(--theme-color);
        border-radius: 50px;
        margin-right: 12px;
        text-transform: capitalize;
        font-size: 18px;
        font-weight: 500;
        padding: 8px 20px;
    }
    .headerright .ressell .sellstuffbtn:hover{
        color: var(--subtheme-color);
        background: var(--theme-color-hvr);
        box-shadow: none;
        border-color: var(--theme-color-hvr);
        -webkit-box-shadow: none;
    }
    .headerright .ressell .sellstuffbtn:focus{
        box-shadow: none;
    }
    .headerright .ressell .sellstuffbtn .cameraicon{
        margin-left: 10px;
    }    
    .distanceFilter{
        display: none!important;
    }
    .resfilte button{
        background:transparent;
        border:none;
    }
    .resfilte button svg{
        fill: rgb(189, 189, 189);
    }
    .resfilte button svg:focus,.resfilte button svg:hover{        
        color: var(--theme-color);
        fill: var(--theme-color);
    }
    .resfilte{
        box-sizing: border-box;        
        align-self: auto;
        flex: 0 0 auto;
    }
    .clsoeres{
        display: block !important;
    }
    .pos_rel{
        position: relative;
    }
    .notification {
        background-color: var(--theme-color);
        height: 26px;
        width: 26px;
        border-radius: 25px;
        position: absolute;
        right: -10px;
        top: -2px;
        border: 2px solid #FFF;
        color: #FFF;
        text-align: center;
        font-size: 12px;
        padding-top: 2px;
    }
    .notification.homepgheade{
        height: 15px;
        width: 15px;
        right:10px!important;
        top: -3px!important;
        z-index: 1;
    }
    .notification.chatHead{
        height: 15px;
        width: 15px;
        left:115px!important; 
        /* right:10px!important; */
        top: 5px!important;
        z-index: 1;
    }
    .chat-bu{
        display: inline-block;
        padding: 10px 18px;
    }
    .menumain .menubtn,.menumain .menubtn:hover{
        background: #fff;
        color: #999999;
        box-shadow: none;
        padding: 10px;
    }
    .menumain .menubtn .nn_menu{
        width: 25px;
        height: 35px;
    }
    img.circleover{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        align-content: center;
        vertical-align: middle;
        user-select: none;
        font-size: 20px;
        color: rgb(255, 255, 255);
        background-color: rgb(224, 224, 224);
        width: 35px;
        height: 35px;
        overflow: hidden;
        border-radius: 50%;
    }
    .bg_layer {
        content: "";
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,.3) !important;
        z-index: -1;
    }
    @media screen and (min-width: 768px){
        .homePopup{
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
        }
        .headerleft{
            width: 65%; 
            flex: 1;
        } 
        .nn_mob_searchbox{
            display: none;
        }
    }
    @media screen and (min-width: 992px){       
        .resfilte, .distanceFilter{
            display: none !important;
        }  
    }          
    @media screen and (max-width: 991px){       
        .headerright .ressell{
            position: fixed;
            bottom: 0px;
            left: 50%;
            transform: translateX(-50%);
            display: block;
            z-index: 99;
        }
        .headerright .ressell .sellstuffbtn{
            font-size: 15px;
            margin-right: 0px;
            padding: 8px 15px;
        }
        .headerright .login{
            display: none;
        }    
        #hdrFx{
            width:100%!important;
            z-index: 99;
        }
        .notification{
            display: none;
        }   
    }
    @media screen and (max-width: 991px) and (min-width: 768px){             
        .chat-bu{
            display: none;
        }
        &.dynamcss #cls_header .resfilte{
            display: block!important;
        }
    }
    @media (max-width:767px){
        .headermain,.headermain.bxShdwnon{
            padding: 8px 12px;
        }
        .headerleft{
            width: 75%;            
            justify-content: space-evenly;
            .logo{
                padding: 1em 0;
            }
            .searchfield.nn_search{
                width: 100%;
            }
        }
        .headerleft .searchfield .searchctn .searchicon{
            margin: 6px 0px 0px 5px;
        }
        .headerleft .searchfield .closeicon{
            right: -5px;
        }
        .headerright{
            width: 25%;
            justify-content: space-evenly;
        }
        .headerright .login,.headerleft .searchfield.nn_search{
            display: none;
        }
        .reslogin{
            display: none;
        }
        .dynamcss .resfilte{
            display: block!important;
        }
        .chat-bu{
            display: none;
        }
        .menumain .menubtn{
            padding: 10px 0px;
        } 
        .notification.homepgheade,.notification.chatHead,.quickbuy{
            display: none;
        }    
        .filepicker .dz-preview ~ .dz-preview{
            margin: 0px 15px 10px 0px;
        }
    }  
    @media screen and (max-width: 767px){
        .headerleft .searchfield.nn_search .searchctn .searchinput {
            width: 100%;            
        }
    }
    @media screen and (max-width: 767px) and (min-width: 425px){
        .headerleft .searchfield .searchctn .searchinput {
            width: 150px;
            padding: 0px 25px 0px 0px;
        }        
    }
    @media screen and (max-width: 425px) and (min-width: 375px){
        .headerleft .searchfield .searchctn .searchinput {
            width: 120px;
            padding: 0px 25px 0px 0px;
        }      
        .filepicker .dz-preview ~ .dz-preview{
            margin: 0px 10px 10px 0px;
        }
    }
    @media screen and (max-width: 375px){
        .headerleft .searchfield .searchctn .searchinput {
            width: 80px;
        }
    }
    @media screen and (max-width: 320px){
        .headerleft .searchfield .searchctn .searchinput {
            width: 50px;
            padding: 0px 10px 0px 0px;
        }
    }
`;

// MenuPopup

export const MenuPopup = styled.div`
    .homePopup{
        z-index: 999 !important;
        overflow-x: hidden;
    }
    .homePopup > div {
        background-color: #FFF;
        height:100%;
    }
    .homePopup nav div {
        width: 100%;
        text-align: left !important;
    }
    img.sidebarprofile{
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        align-content: center;
        vertical-align: middle;
        user-select: none;
        font-size: 20px;
        color: rgb(255, 255, 255);
        background-color: rgb(224, 224, 224);
        width: 100px;
        height: 100px;
        overflow: hidden;
        border-radius: 50%;
        border-width: 2px;
        border-style: solid;
        border-color: rgb(255, 255, 255);
        border-image: initial;
    }
    .menu-icon a{
        font-size: 14px;
        color: var(--theme-color);
        text-decoration: none;
        display: block;
    }
    .menu-subicon{
        font-size: 22px;
        min-width: 39px;
        display: inline-block;
        text-align: center;
    }
    .sideMenu{
        padding: 10px 0 10px 10px;
        cursor: pointer;
    }
    .sideMenu:hover {
        background-color: rgb(238, 238, 238);
    }
    .sidebarprofile,.rtlprofilename{
        cursor: pointer;
    }
    .nn_textClr{
        color: var(--subtheme-color);        
    }
    @media screen and (min-width: 768px){
        .homePopup{
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
        }
    }
    @media screen and (max-width: 767px){
        .bgresclg{
            background-color: #fff;
        }
    }
`;

//  Category list  

export const CategoryListName = styled.div`           
    .cls_cate_mbl:before {
        content: "";
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 6px dashed;
        border-top: 4px solid\9;
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        position: absolute;
        top: 27px;
        right: 20px;
        z-index: 9;
    } 
    select.nn_selectbox,.cls_selectafter{
        background: var(--theme-color);        
        border: none;       
        appearance: none;
        color: var(--subtheme-color) !important;
        text-decoration: none;
        font-size: 17px;
        font-weight: 600;
        margin-left: 25px
    }
    .cls_selectafter div img,#menu-category div img{
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #fff;
        border-radius: 50px;
        border: 1px solid #000;
    }  
    .nn_selectlabel{
        font-size: 22px;
        color: #fff;
        font-weight: 500;
        margin-top: 15px;
        z-index: 99;
        margin-left: 40px;
        pointer-events: none;
    }
    #menu-category div ul{
        background: var(--theme-color);  
        color: var(--subtheme-color) !important;
    }
    .cls_selectafter div svg,.cls_selectafter::before,.cls_selectafter::after{
        display: none;
    }
    select:focus{
        box-shadow: none;
        outline: none;        
    }        
`;

// banner

export const Banner = styled.div`
    /* padding-top: 80px; */
    &.nn_banner{
        padding-top: 80px;
    }
    &.nn_bannnerHide{
        padding-top: 0px;
    }  
    .banner img{
        width: 100%;
        height: 100% !important;
        object-fit:contain;
    }
    .fKpnSY {
        width: 100%;
        height: 350px;  
        overflow: hidden;
        align-items: center;
        position: relative;
        cursor: pointer;
        /* margin-top: 28px; */
        z-index: 9;
    }
    .fKpnSY .btFx img{
        cursor: pointer;
    }
    .fKpnSY .slick-dots li {
        margin:0px!important;
    }
    .fKpnSY .slick-slider{
        z-index: 99;
        /* margin-top: 30px;   */
        position: unset;
    }
    .fKpnSY .slick-arrow.slick-prev{
        background-image: url(${Leftarrow});
        z-index: 99;
        display: none !important;
        top: 50%!important;
        width: 40px!important;
        background-size: 60%;
        background-color:var(--theme-color);
        height: 40px !important;
        left:5px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
        transform: translateY(-50%) !important;
    }
    .fKpnSY .slick-arrow.slick-next{    
        background-image: url(${Rightarrow});
        z-index: 99;
        display: none !important;
        top: 50%!important;
        width: 40px!important;
        background-size: 60%;
        background-color:var(--theme-color);
        height: 40px !important;
        right:5px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
        transform: translateY(-50%) !important;
    }
    .fKpnSY .slick-arrow.slick-next::before{
        content:"";
    } 
    .fKpnSY .slick-arrow.slick-prev::before{
        content:"";
    } 
    .fKpnSY.btFx ul.slick-dots li.slick-active button:before {
        font-size: 10px;
        color: #fff;
        opacity: 1;
    }
    .fKpnSY.btFx ul.slick-dots li button::before {
        font-size: 10px;
        color: #fff;
    }
    .fKpnSY.btFx .slick-slide.slick-active.slick-current{
        z-index: 1;
    }
    .SGfuc {
        position: absolute;
        color: white;
        left: 0;
        top: 35px;
        margin: 5px;
        background: transparent;
        border: none;
        z-index: 999;
    }
    .gnzmKg {
        width: 40px;
        height: 40px;
    }
    .gnzmKg svg{
        fill:#fff;
    }
    @media screen and (min-width: 1200px){
        .fKpnSY.btFx ul.slick-dots {
            bottom: 35px!important;
        }
    }
    @media screen and (max-width: 1024px){
        .fKpnSY.btFx ul.slick-dots {
            bottom: 16px!important;
        }
        .SGfuc{
            top:20px;
        }  
        .banner{
            height: 200px !important;
        }      
    }
    @media screen and (max-width: 991px){
        &.nn_banner{
            padding-top: 0px;
        }
    }
    @media screen and (max-width: 991px) and (min-width: 768px){
        padding-top: 0;
        .banner img{
            object-fit: unset !important;
        }
        .banner{
            height: 170px !important;
        }    
        .fKpnSY.btFx ul.slick-dots {
            bottom:16px!important;
        }
    }
    @media screen and (max-width: 767px){       
        padding-top: 0;
        .banner{
                height: 80px !important;
        }
        .fKpnSY.btFx ul.slick-dots{
            bottom:10px!important;
        }
        .fKpnSY.btFx img{
            height: 80px !important; 
            object-fit: cover;
            width:100%;        
        }    
        .fKpnSY .slick-arrow.slick-next{
            background-size: 60%;
            display:none !important;
        }
        .fKpnSY .slick-arrow.slick-prev{
            background-size: 60%;
            display:none !important;
        }
        .fKpnSY.btFx ul.slick-dots {
            bottom:0px!important;
        }
    }
`;

// Home Products

export const HomeProduct = styled.div`
    .home_product{
        padding: 0px 10px;
        position: relative;
    }
    .home_product .rermode{
        display: none;
    }
    .home_product .allproducts .proctn,.addproduct{
        display: block;
        width: Calc(100%/5);
        border-radius: 8px;
        position: relative;
        padding: 15px;
    }
    .home_product .allproducts4 .proctn,.addproduct{
        display: block;
        width: Calc(100%/5);
        border-radius: 8px;
        position: relative;
        padding: 15px;
    }
    .home_product .allproducts4 .nn_filter{
        display: block;
        width: Calc(100%/3);
        border-radius: 8px;
        position: relative;
        padding: 15px;
    }
    .favBtn {
        z-index: 1;
    }
    .favBtn svg {
        position: relative;
        z-index: -1;
    }
    .home_product .productctn{
        display: flex;     
        align-items: flex-start;   
    }
    .home_product .productctn.productctnload{
        display:block !important;
    }
    .nn_loader{
        display: flex;
        align-items: flex-start;
    }
    .home_product .productctn .allproducts .nn_filter{
        width: calc(100%/4);
    }
    @media screen and (max-width: 1024px){
        .home_product .allproducts .proctn{
            width: calc(100% / 4);
        }    
        .home_product .allproducts4 .proctn,.addproduct{
            width: calc(100% / 3);
        }           
    }
    @media screen and (max-width: 991px) and (min-width:768px){
        .home_product .allproducts .proctn,.addproduct,.home_product .productctn .allproducts .nn_filter,
        .home_product .allproducts4 .proctn,.addproduct4,.home_product .productctn .allproducts4 .nn_filter{
            width: calc(100% / 3);
        }
    }
    @media screen and (max-width: 991px){
        .rermode .flx{
            display: none;
        }
        .home_product{
            margin-top: 0px !important;
        }
    }
    @media screen and (max-width: 767px){
        .home_product .allproducts .proctn,.addproduct,.home_product .productctn .allproducts .nn_filter,
        .home_product .productctn .allproducts4 .nn_filter,.addproduct4,.home_product .allproducts4 .proctn{
            width: calc(100% / 3);
            padding: 0px;
        }
        .home_product .allproducts4 .proctn .allprodetails {
            display: none;
        }
        .nn_productimg .inner{
            height:100% !important;
        }
        .productmain .productctn .prosection{
            height:100% !important;
        }
    }
`;

// Products

export const Product = styled.div`
    .productmain{
        padding-bottom: 0px;
        padding-top: 20px;
    }
    .productmain .productctn .allproducts,.productmain .productctn .allproducts4{
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .productmain .productctn .prosection,.addproduct .addprosection,.addproduct4 .addprosection{
        height: 300px;
    }
    .productmain .productctn .prosection,.addproduct .addprosection,.addproduct4 .addprosection{
        background-color: #fff;
        box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.12);
        border-radius: 8px;
    }
    .productmain .productctn .bgcolor{
        box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.12);
        height: 300px;
    }
    .productmain .productctn .allproducts .nn_homproductctn{
        text-decoration: none;
    }
    .productctn .nn_adfilter{
        width: 320px;
        position: sticky;
        top: 90px;
        z-index: 9;
        left: 0px;
    }
    .cls_overvisi{
        overflow: visible !important;
        display: none;
    }
    .noneedfillter{
        display: none;
    }
    .bgclaye{
        left: 15px;
        min-width: 222px !important;
        bottom: 25px;
        z-index: 6;
        display: block;
        position: absolute;
        font-size: 16px;
        text-align: left;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px;
        margin-top: 4px;
        border-radius: 8px;
        background-color: white;
    }
    .submiresposndive{
        min-width: 222px !important;
    }
    .nn_adfilter{
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
        background: rgb(255, 255, 255);
        border-radius: 8px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(238, 238, 238);
        width: 100%;
        overflow-x: hidden;
        max-height: 635px;
        margin: 15px 0px 0px 15px;
    }
    .nn_filter1{
        width: calc(100% - 320px);
        padding-bottom: 110px;
    }
    .allproducts1{
        width: 100% !important;
    }
    .nn_filtervalue{
        margin: 0px !important;
        padding: 0px !important;
        text-align: left;
    }
    .nn_filtervalue span{
        font-size: 13px;
        border: 1px solid var(--theme-color);
        background-color: var(--theme-color);
        padding: 8px 10px;
        color: var(--subtheme-color);
        border-radius: 5px;
        font-weight: 600;
        margin: 15px 0px 0px 15px;
        display: inline-block;
    }
    .nn_filtervalue span svg{
        color: #fff;
        fill: #fff;
        font-weight: 600;
        font-size: 14px;
        margin-top: -2px;
        margin-right: -6px;
        cursor: pointer;
    }
    .nn_filter{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .nn_filter .proctn{
        display: block;
        width: Calc(100%/4);
        border-radius: 8px;
        position: relative;
        padding: 15px;
    }
    .nn_filter4 .proctn,.nn_filter4 .addproduct4{
        display: block;
        width: Calc(100%/3);
        border-radius: 8px;
        position: relative;
        padding: 15px;  
    }
    .car-daea{
        width:100%;
        float: left;  
        padding: 8px;
    }
    .allprodetails{
        padding: 15px 5px;
    }
    .productdetails{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .productdetails .prodetailsname {
        padding: 0px;
        width: calc(100% - 65px);
    }
    .productdetails .prodetailsname strong{
        text-transform: capitalize;
    }   
    .fznnpf{
        fill: currentcolor;
        user-select: none;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        transition: fill 0.25s ease 0s;
    }
    .fznnpf:focus{
        outline:none!important;
    }
    .favicon1{
        position: absolute;
        bottom: 37px;
        right: ${(props) => (props.rtl && "unset")};
        left: ${(props) => (props.rtl && "60px")};
        right: 60px;
        left: unset;
    }
    .favicon{
        position: absolute;
        bottom: 32px;
        right: ${(props) => (props.rtl && "unset")};
        left: ${(props) => (props.rtl && "60px")};
        right: 60px;
        left: unset;
    }
    .EditBtn,.chatimg{
        padding-right: 5px;
        text-align: right;
    }
    .EditBtn button,.chatimg button.nn_chatBtn{
        background-color: var(--theme-color);
        border: none;
        color: var(--subtheme-color);
        padding: 7px;
        line-height: 1;
        border-radius: 50px;
    }
    .EditBtn button .editicon,.chatimg button.nn_chatBtn .nn_chatIcon{
        font-size: 16px;
    }
    .nn_productimg .inner,.addproduct .addprosection .make_money{
        height: 230px;
        width: 100%;
        border-radius: 8px 8px 0px 0px;
    }
    .addprosection .make_money{
        text-align: center;
    }
    .nn_productimg .inner
    {
        overflow: hidden;
    }
    .nn_productimg .inner:hover img {  
        -moz-transform: scale(1.2); 
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
    }
    .nn_productimg .inner img
    {
        transition: all .3s;
    }
    .nn_productimg .inner img, .addproduct .addprosection .make_money img{ 
        height: 100%;
        width: 100%;
        border-radius: 8px 8px 0px 0px;
        object-fit: cover;
    }
    .postbtn{
        padding: 15px;
    }
    .postbtn .ptbtn{
        padding: 5px 35px;
        border: none;
        border-radius: 50px;
        margin: 0 auto;
        background: var(--theme-color);
        color: var(--subtheme-color);
        display: block;
        font-size: 20px;
        font-weight: 600;
    }
    .postbtn .ptbtn:focus{  
        outline: none;
    }
    .inner .featured{
        background: var(--theme-color);
        color: var(--subtheme-color);
        display: inline-block;
        position: absolute;
        right: 15px;
        top: 15px;
        padding: 5px 15px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 20px 8px 0px 20px;
    }
    .inner .freeproduct{
        background: var(--theme-color);
        color: var(--subtheme-color);
        display: inline-block;
        position: absolute;
        left: 15px;
        top: 15px;
        padding: 5px 15px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px 20px 20px 0px;
    }
    .inner > img {
        border-radius: 8px;
    } 
    .nn_loadmore{
        width: 100%;
        padding: 35px 0px;
    }
    .nn_loadmore .nn_loadbtn{
        margin: 0 auto;
        display: block;
        background:  var(--theme-color);
        color: var(--subtheme-color);
        border: none;
        padding: 8px 30px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: 600;
    }
    .nn_loadmore .nn_loadmorectn{
        margin: 0 auto;
        display: block;
        background:  #fff;   
        font-size: 18px;
        font-weight: 600;
        text-align: center;
    }
    .productmain .nn_notFound{
        width: 100%;
        text-align: center;
        height: auto;
        padding-bottom: 30px;
    }
    .nn_sidead{
        position: sticky;
        top: 170px;
        padding: 15px;
        text-align: center;
    }
    .nn_sidead1{
        position: sticky;
        top: 170px;        
        padding: 15px 0;
        text-align: center;
        width: 100%;
        height: 100% !important;
    }
    @media screen and (min-width: 768px){
        .postbtn .ptbtn{
            padding: 5px 15px;
            font-size: 18px;
        }
    }
    @media screen and (min-width: 992px){
        .productmain .nn_searchfilter{
            position: absolute;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
        }       
        .productmain .nn_loadmorefilter{
            position: absolute;
            bottom: 0px;
            left: 50%;
        }
        .productmain .nn_search_filter{
            position: absolute;
            top: 15%;
            left: 45%;
        }
    }
    @media screen and (min-width: 1200px){
        .bgclaye{
            left: 15px;
            min-width: 270px !important;
        }
        .submiresposndive{
            min-width: 270px !important;
        }
    }
    @media screen and (max-width: 1200px){
        .nn_filter,.nn_filter1{
            width: 100%;
            padding-bottom: 0px;
        }
        .nn_filter .proctn,.nn_filter4 .proctn,.nn_filter4 .addproduct4{
            width: calc(100% / 3);
        }
    }
    @media screen and (max-width:991px){
        .nn_sidead,.nn_sidead1{
            display: none;
        }
    }
    @media screen and (max-width: 991px) and (min-width:768px){
        .productctn .nn_adfilter{
            display: none;
        }
        .nn_filter{
            width: 100%;
        }       
        .bgclaye{
            transform: none!important;
        }
        .reset.resposnreset{
            position: absolute;
            right: 10px;
            top: 0px;
            box-shadow: none;
        }
    }
    @media screen and (max-width: 767px){
        .productctn .nn_adfilter{
            display: none;
        }
        .nn_filter,.nn_filter .proctn,.nn_filter4 .proctn,.nn_filter4 .addproduct4{
            width: 100%;
        } 
        .reset.resposnreset{
            top: -60px;
        }
        .dropdownStyle {
            transform: none!important;
        }
        .bgclaye{
            position: fixed !important;
            bottom: 0px!important;
            height: 100%!important;
            top: auto!important;
            background-color: rgba(0, 0, 0, 0.5)!important;
            width: 100%!important;
            z-index: 100!important;
            left:0px!important;
            right:0px;
            transform: none!important;
        } 
        .submiresposndive{
            bottom: 0px!important;
            top:auto!important;
            background-color:rgba(0, 0, 0, 0.03)!important;
            box-shadow: none;
            z-index: 99!important;
            border-radius: 0px!important;
            width:100%;
            box-shadow: none!important;
        }
        .nn_loadmore{
            width: 100%;
            padding: 0px;
        }
    }
`;

// Advanced filter

export const AdvancedFilter = styled.div`
    .nn_home_filter .nn_respfile{
        padding: 10px 15px;
    }
    .nn_home_filter .nn_respfile .nn_locfilter .respimg,.dropdown.pric{
        padding: 3px 0px;
    }
    .location-filter.first-loct{
        width: 100%;
        background-color: transparent!important;
        border: none;
        text-align: left;
        padding:3px;
    }
    .location-filter input[type="button"]{
        background-color: transparent;
        border:none;
        width: 100%;
        text-align: left;
        font-weight:500;
    }
    .location-filter input[type="button"]:focus{
        outline:none;
    }
    .location-filter{
        background-image: url(${Downarrow});
        background-repeat: no-repeat;
        background-position: right center;
        cursor: pointer;
    }
    .location-filter.newpri{
        font-size: 16px;
        font-weight: 600;
        text-align: left;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1 1;
        padding: 0px;
        overflow: hidden;
        line-height: 31px;
    }
    .location-filter.newpri.dropdown-toggle::after{
        border:none;
    }
    /* body[dir="rtl"] .location-filter.respimg{
        background-position: left center;
        background-image: url(../../../assets/img/refillrtl.png);   
    }
    .location-filter.respimg{
        background-image: url(../../../assets/img/refill.png);
        background-repeat: no-repeat;
        background-position: right center;
        cursor: pointer;
    }
    .location-filter.first-loct.respimg.allctartdd{
        width:97%;
    }
    .location-filter.respimg{
        background-image: url(../../../assets/img/refill.png);
        background-repeat: no-repeat;
        background-position: right center;
        cursor: pointer;
    }
    .location-filter.first-loct.respimg.allctartdd{
        width:97%;
    }
    body[dir="rtl"] .location-filter.respimg{
        background-position: left center;
        background-image: url(../../../assets/img/refillrtl.png);
    } */
    .chng-loc{
        font-size: 20px;
        font-weight: 700;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: rgb(44, 44, 44);
    }
    .filterhover-eff:hover{
        height: 50px;
        line-height: 40px;
        /* padding: 0px 10px; */
        background: #eee;
        margin: 0px 15px;
    }
    .filterhover-eff{
        height: 50px;
        line-height: 40px;
        padding: 0px 10px;
        margin: 0px 15px;
    }
    .reset {
        margin: 20px 0 20px 10px;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.12) 0px 2px 4px 0px;
        border-radius: 25px;
        padding: 10px 20px;
        line-height: 1;
        color: var(--subtheme-color);
        font-weight: bold;
        background-color: #FFF;
        border: none;
    }
    .dropdown-menu.show{
        right: 0;
    }
    .filterBx > span {
        border: 1px solid #CCC;
        padding: 5px 10px;
        border-radius: 25px;
        color: rgb(117, 117, 117);
        margin-right: 6px;
        font-size: 14px;
        font-weight: bold;
    }
    .filterBx svg {
        color: rgb(189, 189, 189);
        font-size: 14px;
        margin-top: -2px;
        margin-right: -6px;
        cursor: pointer;
    }
    .none {
        display: none !important;
    }
    .flx {
        display: flex;
    }
    .newresfileter .flx{
        display: none;
    }
    input.location-filter.price-filt{
        background-color: transparent;
        border: none;
        width: 100%;
        text-align: left;
        font-weight:500;
    }
    .location-filter.most-recent{
        background-color: transparent;
        width:100%;
        border: none;
        font-size: 16px;
        font-weight: 600;
        text-align: left;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1 1;
        padding: 0px;
        overflow: hidden;
        line-height: 31px
    }
    select:focus.location-filter.most-recent {
        outline:none;
    }
    .cls_onlyboth{
        margin: 8px 0px;
        display: flex;
        flex-wrap: wrap;
    }
    .cls_onlyboth span{
        margin: 5px 0px 0px 15px !important;
    }
    .nn_reset{
        text-align: right;
        margin-right: 10px;
    }
    .location-filter.country{
        background-color: transparent;
        line-height: 40px;
        width: 100%;
        background-image: url(../../../assets/img/whiteup.png);
        background-position: 95%;
        border: 1px solid #fff;
        border-radius: 4px;
        padding-left: 10px;
        color: #fff;
        background-size: 35px;
    }
    .location-filter.country:hover{
        background-color: rgba(255, 255, 255, 0.3);
    }
    .location-filter.newpri.dropdown-toggle::after{
        content:none;
    }
    .locatext{
        font-size: 14px;
        font-weight: 400;
        color: rgb(117, 117, 117);
        line-height: 11px;
        margin-top: 4px;
    }
    .locatext.locatingval{
        display: inline-block;
        width: 100%;
        vertical-align: middle;
        font-size: 16px;
        color: rgb(44, 44, 44);
    }
    .locmap{
        font-size: 16px;
        font-weight: 600;
        text-align: left;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1 1 0%;
        padding: 0px;
        overflow: hidden;
        line-height: 31px;
    }
    .dropdown-menu.sortby.show,.dropdown-menu.sortby{
        position: absolute !important;
        will-change: transform !important;
        top: 0px !important;
        left: 0px !important;
        transform: translate3d(0px, 0px, 0px) !important;
    }
    .filterBx > span{
        border-radius: 10px;
        margin-left: 5px;
    }
    .location-close.ltn.revw{
        padding: 20px;
    }
    .location-close.ltn{
        background: transparent;
        border: none;
        line-height:1;
    }
    .location-close{
        color: var(--subtheme-color);
        font-size: 30px;
        margin-right: 20px;
        opacity: 1;
    }
    .nn_loc_btn{
        text-align: right;
        float: right;
        vertical-align: middle;
    }
    .min-price{
        width:40%;
        border:none;
        border-bottom:1px solid #b5b0b0;
    }
    .max-price{
        width:40%; 
        border:none;
        border-bottom:1px solid #b5b0b0;
    }
    .min-price, .max-price{
        outline: none
    }
    .min-price::-webkit-inner-spin-button, .min-price::-webkit-outer-spin-button, .max-price::-webkit-inner-spin-button, .max-price::-webkit-outer-spin-button{
        -webkit-appearance: none;
    }
    .intedement-val{
        width:20%;
        text-align: center;
        font-weight: bold;
    }
    select {
        -moz-appearance: none;
        -webkit-appearance: none;
    }  
    select::-ms-expand {
    display: none;
    }
    .sortby{
        padding: 0;
        margin: 0;
    }
    .sortby > div {
        padding: 14px 12px;
        line-height: 1;
        cursor: pointer;
    }
    .sortby > div:hover {
        background-color: rgb(238, 238, 238);
    }
    .sortby svg {
        float: right;
        color: var(--subtheme-color);
    } 
    .priSpace{
        padding: 10px;
    }
    .dropdown-menu.priSpace.show{
        top:14px!important;
    }
    .dropdown-menu.priSpace.show{
        top:14px!important;
    }
    .fxFilt {
        position: fixed;
        top: 55px;
        z-index: 95;
        left: 0;
        right: 0;
        background-color: #FFF;
        padding: 8px 0;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 5px 5px 0px;
    }
    .fxFilt > .flx{
        max-width: 1140px;
        margin: 0 auto;
    }
    .fxFilt > .flx > .overall-filt, .fxFilt > .flx > .reset{
        border-radius: 0;
        box-shadow: none;
        margin: 0;
    }
    .fxFilt > .filterBx{
        display: none
    }
    .pricePop{
        color: var(--subtheme-color);
        display: inline-block;
        font-size: 16px;
        white-space: pre-wrap;
        line-height: 21px;
        text-align: center;
        width: 100%;
    }
    .custom-labels .rangeslider-horizontal .rangeslider__handle-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
    }  
	.custom-labels .rangeslider-horizontal .rangeslider__handle:after {
	    position: static;
	}
    .custom-labels  .rangeslider-horizontal .rangeslider__fill,.custom-labels .rangeslider-horizontal .rangeslider__fill,
    .rangeslider-horizontal .rangeslider__fill,.cls_locslider .rangeslider-horizontal .rangeslider__fill {
	    background-color: var(--theme-color);
    }
    .btn1{
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        border: 1px solid var(--theme-color);
    }
    .btn2{
        background-color:  #fff;
        color: var(--theme-color);
        border: 1px solid var(--theme-color);
    }
    .btn1,.btn2 {       
        border-radius: 24px;
        padding: 8px 20px;
        line-height: 1;
        font-size: 16px;
        font-weight: 700;
        min-height: 40px;
        letter-spacing: .2px;
        margin-top: 15px;
    }    
    @media screen and (max-width: 991px){
        .locatext.locatingval{
            width: 70%;
        }
        .locmap.popress {
            width: 30%;
            display: inline-block;
            text-align: right;
            padding-right: 20px;
            vertical-align: middle;
        }
        .filterhover-eff:hover{
            margin:0px;
            padding:0px;
        }
        .filterhover-eff{
            margin:0px;
            padding: 0px;
        }
    }
    @media screen and (max-width: 991px) and (min-width:768px){
        .nn_home_filter .nn_respfile{
            padding: 15px;
        }
    }
    @media screen and (max-width: 767px){
        .nn_home_filter .nn_respfile{
            padding: 15px;
        }
        .nn_home_filter{
            position: relative;
        }
    }
    `;
export const AdvancedFilter1 = styled.div`
    .nn_advancedflt .nn_adtitle{
        font-size: 20px;
        font-weight: 600;
        color: var(--subtheme-color);
        padding: 15px;
        display: block;
        text-align: center;
        }
        .cls_themeclr{
        color: var(--subtheme-color);
        font-size: 20px;
        font-weight: bold;
    }
    .cls_themeclr_res{
        color: var(--subtheme-color);
        font-size: 20px;
        font-weight: bold;
    }
    .cls_themeclr_res{
        display: none;
    }
    .cls_homefilter .cls_subname{
        font-size: 14px;
    }
    .cls_homefilter section {
        display: inline-block;
        width: 100%;
    }
    .cls_homefilter .ewsakU{
        padding:10px 15px;
        position: relative;
    }
    .cls_homefilter .ewsakU .rightyesd {
        font-size: 16px;
        position: absolute;
        right: 10px;
        width: auto !important;
        cursor: pointer;
    }
    .cls_homefilter .yearway.respmileage{
        text-transform: capitalize;
        width: 100% !important;
        padding-right: 10px;
    }
    .ewsakU {
        padding:10px 6px;
        background-color: transparent;
        border:none;
        width:100%;
        float: left;
    }
    .ewsakU.yesrsnover{
        padding-top: 5px!important;
    }
    .ewsakU.yesrsnover:hover{
        background-color: transparent!important;
    }
    .nn_adlabel span[class*=" MuiCheckbox-checked-"],
    .nn_checkbox,.nn_adlabel{
        color: var(--theme-color) !important;
        fill: var(--theme-color) !important;
    }    
    .input-range__label{
        font-family: inherit !important;
        font-weight: bold;
    }
    .input-range__label-container{
        color: var(--theme-color);
    } 
    span.input-range__label.input-range__label--bottom-min ,span.input-range__label.input-range__label--bottom-max {
        display: none;
    }
    .cls_inrange .input-range
    {
        padding: 20px 15px !important;
    }
    .cls_adinrange
    {
        margin-top: 20px !important;
    }
    .cls_inrange .input-range__label--value {
        top: -2rem;
        right: -8px;
    }
    .cls_inrange .input-range__label-container{
        left: 0;
    }
    span.input-range__label.input-range__label--min , span.input-range__label.input-range__label--max{
        display: none;
    }
    .fIVfGS {
        position: relative;
        width:100%;
        float: left;
    }
    .yearway{
        width: 60%;display: inline-block;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
        color: rgb(44, 44, 44);
    }
    .yearway.respmileage {
        width:40%!important;
    } 
    .rightyesd{
        width:40%; 
        display: inline-block;
        text-align: right;
    }
    .rightyesd.reskm{
        width:60%!important;
    }
    .makestylee{
        position: absolute; 
        font-size: 16px;
        font-weight: bold;
        color: rgb(44, 44, 44);
        display: inline-block;
        left:0px;
        top:3px;
    }
    .makestylee1 {
        /* position: absolute;  */
        font-size: 16px;
        font-weight: bold;
        color: rgb(44, 44, 44);
        display: inline-block;
        left:0px;
        top:3px;
    }
    .dPKTsi{
        width:100%;
        float: left;
    }
    .maghgh{
        margin:20px;
    }
    .inpydeanrr{
        margin: 0 auto;
        border-bottom: 1px solid rgb(238, 238, 238);
        padding: 20px 25px;
        width:100%;
        float: left;
    }
    .nn_homefilter .nn_fliterctn .nn_fltproctn{
        display: block;
        font-size: 16px;
        text-transform: capitalize;
        color: #000;
        font-weight: 600;
        padding-bottom: 5px;
    }
    .nn_homefilter .nn_fliterctn{
        padding: 10px 15px;
        position: relative;
        /* border-bottom: 2px solid #eeeeee; */
    }
    .nn_homefilter .nn_fliterctn .nn_fltproctn{
        display: block;
        font-size: 16px;
        text-transform: capitalize;
        color: #000;
        font-weight: 600;
        padding-bottom: 5px;
    }
    .nn_fliterctn .nn_adlabel{
        margin-left: 0px;
    }
    .nn_fliterctn .nn_adlabel span:last-child{
        font-size: 15px;
        font-weight: 400;
    }
    .nn_adlabel{
        display: flex !important;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }   
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    @media (min-width: 1200px) {
        body.ReactModal__Body--open{
            overflow-y: hidden!important;
        }
    }
    @media (min-width: 768px) and (max-width: 1200px) {  
        .yearway.respmileage{
            width: 35%!important;
        }
        .rightyesd.reskm{
            width: 65%!important;
        }
    }
    @media screen and (max-width: 991px){
        .cls_themeclr{
            display: none;
        }
        .cls_themeclr_res{
            display: block !important;
        }
    }
    @media screen and (max-width: 767px){
        .ewsakU{
            padding: 10px 0px;
        }
        .nn_advancedflt #srcFil{
            display: block;
        }
        .nn_advancedflt .nn_adtitle{
            /* text-align: left; */
            padding: 0px 0px 15px 0px;
        }
    }
`;

// Chatpage icon
export const ChatPageIcon = styled.div`
    .mesg_conver {
        display: none;
    }
    @media screen and (min-width: 768px){
        .mesg_conver .notification.homepgheade{
            display: block;
            right: -2px !important;
        }
        .notification {
            background-color: var(--theme-color);
            height: 26px;
            width: 26px;
            border-radius: 25px;
            position: absolute;
            right: -10px;
            top: -2px;
            border: 2px solid #FFF;
            color: var(--subtheme-color);
            text-align: center;
            font-size: 12px;
            padding-top: 2px;
        }
        .notification.homepgheade{
            height: 15px;
            width: 15px;
            right:10px!important;
            top: -3px!important;
            z-index: 1;
        }
        .notification.chatHead{
            height: 15px;
            width: 15px;
            left:115px!important; 
            /* right:10px!important; */
            top: 5px!important;
            z-index: 1;
        }        
    }
    @media screen and (max-width: 991px){
        .mesg_conver {
            display: block;
            position: fixed;
            bottom: 25px;
            right: 15px;
            z-index: 99;
            background: #fff;
            box-shadow: 0px 0px 10px #888;
            padding: 10px;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            text-align: center;
        }
    }
`;

// footer
export const FooterMain = styled.div`
    .nn_footer{
        padding: 80px 0px 0px;
        position: relative;
        text-align: left !important;
    }
    .nn_footer .nn_ftmain{
        padding: 0px 120px 70px 120px;
        z-index: 1;
        width: 100%;
    }
    .nn_footerfirstpart{
        margin-top: 50px;
        border-radius: 20px;
        padding: 0px;
        position: relative;
        z-index: 1;
        background-color: #fff;
        box-shadow: 0px 3px 10px 5px rgba(0,0,0,0.12);
        border-radius: 20px;
    }
    .nn_footermain,.nn_footermain .nn_footermain1{
        width: 100%;
        position: relative;
        height: auto;
    }
    .nn_footermobileimg{
        position: absolute;
        bottom: 0;
        left: 40px;
    }
    .nn_footermain,.nn_footerapps{
        display: flex;
        align-items: center;
        z-index: 2;
    }
    .nn_footerapps{
        justify-content: center;
    }
    .nn_ftmainctn{
        padding: 45px 0px;
        text-align: center;
    }
    /* .nn_footerfirstpart::before{
        content: "";
        background-color: #fff;
        position: absolute;
        bottom: 0;
        height: 280px;
        width: 100%;
        left: 0;
        right: 0;
        z-index: 0;
        box-shadow: 0px 1px 3px 1px rgba(0,0,0,0.12);
        border-radius: 20px;
    } */

    /* .nn_footermobileimg{
        position: absolute;
        left: 0;
        bottom: 0;
    } */
    /* .nn_footermain .nn_footermobileimg img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    } */
    /* .nn_ftmainctn{
        padding: 83px 0px 0px;
    } */
    h1.nn_getfreeapp{
        color: var(--theme-color);
        font-size: 48px;
        font-weight: 900;
        line-height: 60px;
        text-transform: uppercase;
        padding-left: 15px;
    }
    h1.nn_getfreeapp1 .frissues{
        font-size: 48px;
    }
    .nn_footerapps .nn_googlepay{
        margin: 0px 15px;
    }
    .nn_footerapps .nn_googlepay{
        width: 200px;
        height: auto;
    }
    .nn_footerapps .nn_googlepay img{
        width: 100%;
        height: auto;
        cursor: pointer;
    }
    .nn_footersecpart{
        position: relative;
        height: auto;
        width: 100%;
        background: var(--theme-color) !important;
    }
    .nn_footersecpart .nn_ftbgimg{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .nn_footersecpart .nn_footersecctn{
        padding: 50px 120px;
        /* position: absolute;
        bottom: 0px; */
        width: 100%;
    }
    .nn_footersecpart .nn_footersecctn .nn_footerlogo img{
        width: 100px;
        height: auto;
        object-fit:contain;
    }
    .nn_footersecpart .nn_footersecctn .nn_ftpara{
        color: var(--subtheme-color);
        font-size: 16px;
        margin-top: 10px;
        opacity: 0.9;
        font-weight: 600;
    }
    .nn_socialicons .nn_ftsocialctn ul{
        padding: 0px;
        margin-top: 30px;
    }
    .nn_socialicons .nn_ftsocialctn ul li{
        list-style: none;
        padding: 0px 15px;
        margin: 0;
        display: inline-block;
    }
    .nn_socialicons .nn_ftsocialctn ul li:first-child{
        padding-left: 0px;
    }
    .nn_socialicons .nn_ftsocialctn ul li a{
        color: var(--subtheme-color);
        font-size: 18px;
    }
    .nn_ftaboutctn ul{
        padding: 0px;
        column-count: 2;
    }
    .nn_ftaboutctn ul li{
        list-style: none;
        padding: 5px 0px;
    }
    .nn_ftaboutctn ul li a{
        text-decoration: none;
        color: var(--subtheme-color);
        font-size: 18px;
        font-weight: 600;
    }
    .nn_ftdropdown{
        display: flex;
        justify-content: center;
        padding-top: 50px;
    }
    .nn_ftdropdown .nn_selectwrapper{
        position: relative;
        display: inline-block;
        margin-right: 10px;
    }
    select{
        -moz-appearance: none !important;
        -webkit-appearance: none !important;
    }
    .nn_formselect .nn_selectlang,.nn_formselect .nn_selectcurrency,.nn_formselect .nn_selectlang svg,.nn_formselect .nn_selectcurrency svg{
        color: #fff;
        margin-top: 0px;
    }
    .nn_formselect .nn_selectlang:focus{
        background-color: unset;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect{
        width: 120px;
        height: 40px;
        border-radius: 10px;
        border: none;
        background: var(--theme-color);
        color: var(--subtheme-color);
        font-size: 17px;
        padding: 5px 15px;
        font-weight: 500;
        box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.12);
        cursor: pointer;
        border: 1px solid var(--subtheme-color);
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect:focus{
        border: 1px solid var(--subtheme-color);
        background: var(--theme-color);
        color: var(--subtheme-color);
        outline: none;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect option{
        background: #fff;
        color: #000;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect option:hover,.nn_ftdropdown .nn_selectwrapper .nn_formselect option:focus{
        background: var(--theme-color);
    }
    .nn_ftdropdown .nn_selectwrapper .nn_downarrow{
        position: absolute;
        right: 8px;
        top: 7px;
        color: var(--subtheme-color);
        pointer-events: none;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect label{
        display: none;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect label .MuiInput-formControl-521{
        margin-top: 0px;
        vertical-align: center;
    }
    .nn_ftdropdown .nn_selectwrapper .nn_formselect label .MuiInput-formControl-521,.MuiSelect-icon-519{
        color: #fff !important;
    }    
    @media screen and (min-width: 768px){
        .nn_footermain{
            height: 270px;
        }
    }
    @media screen and (min-width:1440px){
        h1.nn_getfreeapp{
            padding-bottom: 30px;
        }
    }
    @media screen and (max-width:1024px){
        .nn_footer .nn_ftmain{
            padding: 0px 60px 60px 60px;
        }
        /* .nn_footermain .nn_footermobileimg img{
            width: 640px;
            bottom: 33px;
        } */
        h1.nn_getfreeapp{
            font-size: 40px;
        }
    }
    @media screen and (min-width:768px) and (max-width: 991px){
        .nn_footer{
            padding: 50px 0px 0px;
        }
        h1.nn_getfreeapp{
            font-size: 38px;
            line-height: 45px;
            padding: 15px 15px;
        }
        .nn_footerapps .nn_googlepay{
            width: 145px;
        }
    }
    @media screen and (max-width: 991px){
        .nn_footer .nn_ftmain{
            padding: 0px 15px 30px 15px;
            width: 100%;
            bottom: 445px;
        }
        .nn_footersecpart .nn_footersecctn{
            padding: 50px 0px;
            text-align: center;
        }    
        .nn_footersecpart .nn_footersecctn .nn_socialicons{
            margin-bottom: 25px;
        }
        /* .nn_footermain .nn_footermobileimg img{
            width: 100%;
            bottom: 33px;
        } */
        h1.nn_getfreeapp{
            font-size: 30px;
        }
        .customresponsive{
            max-width: 100%;
            overflow: scroll;  
            -webkit-overflow-scrolling: touch;
        }
    }   
    @media screen and (max-width: 767px){
        .nn_footer{
            padding: 0px;
        }
        .nn_footer .nn_ftmain{
            padding: 0px 15px 30px 15px;
            width: 100%;
            bottom: 430px;
        }
        .nn_footerfirstpart{
            padding: 30px 15px 25px 15px;
            margin-top: 10px;
        }
        .nn_footerfirstpart .nn_footermobileimg{
            display: none;
        }
        .nn_ftmainctn{
            padding: 0px 0px 15px 0px;
        }
        .nn_footermain{
            display: flex;
            flex-direction: column;
            height: auto;
        }
        .nn_footerapps{
            height: auto;
            justify-content: center;
        }
        h1.nn_getfreeapp{
            font-size: 32px;
            line-height: 45px;
            padding: 0px;
            text-align: center !important;
        }
        .nn_footersecpart .nn_footersecctn{
            padding: 65px 0px;
            text-align: center;
        }
        .nn_footerapps .nn_googlepay{
            width: 130px;
        }
        .nn_footerapps .nn_googlepay img{
            padding: 0px 5px;
        }
        .nn_ftdropdown{
            padding: 30px 0px 5px 0px;
        }
    }
`;

// chatpage
export const ChatPage = styled.div`
    background-color: #f6f5f7;
    margin-top: 85px;
    .nn_chatmainctn{
        padding: 35px 0px;
    }
    .dropdown-toggle::after{
            display: none;
        }
    .container{
        padding-right: 15px;
        padding-left: 15px;
        margin-right: auto;
        margin-left: auto;
    }
    .nn_chatreswrapper{
        width: 100%;
        height: 75vh;
        display: flex;
        box-shadow: 0px 0px 4px #cccc;
        border-radius: 10px;
        border-top: 1px solid #ddd;
    }
    .nn_chatreswrapper.active .nn_reschat{
        width: 100%;
        display: flex;
    }
    .nn_chatrtwrapper.active{
        width: 75%;
        background-image: url(${ChatBgImg1});;
        background-repeat: no-repeat;
        background-position: center;
    }
    .nn_chatrtwrapper.active p,.nn_chatrtwrapper p {
        text-align: center;
        padding: 15px;
        font-size: 20px;
        color: #6e7173;
        border-bottom: 1px solid #ddd;
    }
    .nn_chatreswrapper .nn_reschat .nn_reschatview.active{
        width: 35%;
        border-right: 2px solid #eee;
        background-color: #fff;
        height: 100%;
        overflow-y: auto;
    }
    .nn_reschatview{
        width: 100%;
        border-right: 2px solid #eee;
        background-color: #fff;
        height: 100%;
        overflow-y: scroll;
    }
    .nn_chatreswrapper .nn_reschat{
        width: 32%;
    }
    .nn_chatsmallscreen{
        display: flex;
        align-items: center;
        padding: 0px 5px 20px;
    }
    .bg-loader{
        position: relative;
    }
    .nn_chat_title span{
        font-size: 25px;
        font-weight: bold;
        text-transform: capitalize;
        padding: 15px;
        color: #222;
    }
    .nn_testactivechat{
        background-color: #f3f5f6;
        border-left: 5px solid var(--theme-color);
        margin-right: 5px;
    }
    .nn_chatprofile{
        padding: 15px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        font-family: var(--theme-fontfamily);
    }
    .nn_chat_proctn{
        display: flex;
        align-items: center;
    }
    .nn_chatprofile .nn_proimg{
        position: relative;
    }
    .nn_chatprofile .nn_proimg img{
        width: 55px;
        height: 55px;
    }
    .notification {
        background-color: var(--theme-color);
        height: 26px;
        width: 26px;
        border-radius: 25px;
        position: absolute;
        right: -10px;
        top: -2px;
        border: 2px solid #FFF;
        color: var(--subtheme-color);
        text-align: center;
        font-size: 12px;
        padding-top: 2px;
    }
    .nn_pro_ctn{
        padding-left: 10px;
        width: 185px;
    }
    .nn_product_img img{
        width: 50px;
        height: 50px;
        border-radius: 50px;
        box-shadow: 0 1px 3px 2px rgba(0,0,0,.12);
        margin-left: 20px;
    }
    .nn_soldctn{
        margin-bottom: 27px;
        position: relative;
    }
    .nn_sold{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 97;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        background: rgb(0, 154, 171);
        transition: top 0.5s ease 0s;
    }
    .pos_rel{
        position: relative;
    }
    .nn_chatproname{
        color: rgb(66, 66, 66);
        font-size: 15px;
        font-weight: bold;
        text-transform: capitalize;
        word-break: break-all;
    }
    .nn_urgent_new .nn_buying_color {
        color: #f54a61;
        font-weight: 600;
        display: flex;
        font-size: 13px;
    }
    .nn_urgent_new .nn_selling_color {
        color: #34ca34;
        font-weight: 600;
        display: flex;
        font-size: 13px;
    }
    .righrsidewharr{
        background-image:url(${ChatBgImg1});
        background-repeat: no-repeat;
        background-position: center;
    }
    .nn_chatrtmain{
        width: 68%;
        font-family: var(--theme-fontfamily);
        position: relative;
    }
    .nn_chatrtmain .nn_pro_img a img,.nn_prodt_img img{
        width: 50px;
        height: 50px;
    }
    .nn_prodt_img img{
        box-shadow: 0 1px 3px 2px rgba(0,0,0,.12);
    }
    .nn_drdn{
        cursor: pointer;
    }
    .nn_drdn.overpg.show,.nn_drdn.show:hover,.nn_drdn.show:focus{
        background-color: #fff;
    }
    .nn_dropdowntoggle{
        padding: 0px !important;
        padding-top: 0px !important;
        min-width: 120px !important;
        border-radius: 5px;
        right: -20px;
        top: 10px;
        cursor: pointer;
        z-index: 99;
        position: absolute;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.2) 0px 3px 8px 0px;
        background-color: white;
    }
    .nn_dropdowntoggle::before{
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #eee;
        top: -10px;
        content: "";
        right: 3px;
        margin-left: -10px;
        position: absolute;
    }
    .nn_dropdowntoggle::after{
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        top: -7px;
        content: "";
        right: 3px;
        margin-left: -10px;
        position: absolute;
    }
    .nn_dropdowntoggle ul li {
        padding: 10px;
        color: #000;
        font-weight: 500;
    }
    .nn_chatrtprofile{
        width: 100%;
        height: 80px;
        padding: 10px;
        display: inline-flex;
        align-items: center;
        background-color: #fff;
    }
    .nn_chatrtprofile div{
        padding: 0px 5px;
    }
    .dropdown-menu.chatbox{
        border: none;
        right: auto;
        min-width: unset;
    }
    .nn_chatrtmain.fd{
        background-image: url(${ChatBgImg});
        box-shadow: 0px 0px 4px #cccc;
    }
    .nn_chatrtmsgctn{
        display: flex;
        flex: 1 1 0%;
        padding: 25px 0px 0px 0px;
        position: relative;
        box-sizing: border-box;
        overflow-y: auto;
        flex-direction: column;
        overscroll-behavior-y: contain;
        height: calc(100% - 260px);
    }
    .nn_chatbt{
        padding: 10px;
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    .nn_chatbtmain{
        background: #fff;
    }
    .nn_chatbtctn{
        margin: 15px;
        display: inline-flex;
    }
    .nn_chatbtn{
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        cursor: pointer;
        font-size: 12px;
        text-align: center;
        border-radius: 5px;
        border: none;
        outline: none;
        padding: 5px 15px;
        margin-right: 10px;
        height:100%;
    }
    .nn_chatinput{
        margin: 0px 15px 15px;
        display: inline-flex;
        width: 100%;
    }
    .nn_chatinput textarea{
        padding: 5px 10px;
        color: #757575;
        background-color: rgb(244, 244, 244);
        border: none;
        outline: none;
        font-size: 15px;
        width: 100%;
        border-radius: 5px;
        height: 70px;
        resize: none;
    }
    .nn_chatsendbtn button img{
        background: var(--theme-color);
        padding: 7px;
        margin-left: 7px;
        border-radius: 3px;
        width: 35px;
        height: 35px;
        vertical-align: baseline;
    }
    .nn_profile_ctn{
        width: 125px;
    }
    .nn_profile_ctn .nn_chatnm{
        font-size: 15px;
        font-weight: bold;
    }
    .chatnm{
        font-size: 16px;
        font-weight: 700;
        text-transform: capitalize;
    }
    .chatnavcl{
        color: rgb(44, 44, 44);
    }
    .dateseen{
        font-size: 11px;
        color: rgb(97, 97, 97);
    }
    .nn_chatnavcl{
        margin-bottom: 3px;
    }
    .nn_pro_price span{
        color:var(--theme-color);
        line-height: 1.2em;
        font-weight: bold;
        font-size: 17px;
    }
    .nn_chatrtmsgctn .nn_senderpart{
        text-align: right;
        float: left;
        margin-right: 0px;
        width: 100%;
        position: relative;
        padding: 5px;
    }
    .nn_chatrtmsgctn .nn_senderpart .nn_leftpart{
        width: auto;
        max-width: 60%;
        float: right;
        padding: 0px 12px;
        word-break: break-all;
    }
    .nn_chatrtmsgctn .nn_senderpart .nn_leftpart .nortltrans{
        background-color: var(--theme-color);
        padding: 8px 12px;
        word-break: break-all;
        border-radius: 8px;
        color: var(--subtheme-color);
        text-align: left;
    }
    .nn_chatrtmsgctn .nn_senderpart .nn_leftpart .rtltranschat{
        background-color: var(--theme-color);
        padding: 8px 12px;
        word-break: break-all;
        border-radius: 8px;
        color: #fff;
        text-align: right;
    }
    .nn_chatrtmsgctn .nn_senderpart .nn_leftpart .dateseen{
        text-align: left;
    }
    .nn_chatrtmsgctn .nn_receivepart{
        text-align: right;
        padding: 5px;
        margin-right: 0;
        width: 100%;
        float: left;
    }
    .nn_chatrtmsgctn .nn_receivepart .nn_leftpart{
        width: auto;
        max-width: 60%;
        float: left;
        padding: 0px 12px;
        text-align: left;
        word-break: break-word;
    }
    .nn_chatrtmsgctn .nn_receivepart .nn_leftpart .nortltrans{
        background-color: var(--theme-color-hvr);
        padding: 8px 12px;
        word-break: break-all;
        border-radius: 8px;
        color: var(--subtheme-color);
    }
    .nn_chatrtmsgctn .nn_receivepart .nn_leftpart .rtltranschat{
        background-color: var(--theme-color-hvr);
        padding: 8px 12px;
        word-break: break-all;
        border-radius: 8px;
        color: var(--subtheme-color);
        text-align: left;
    }
    .nn_newpdd.isblock{
        position: absolute;
        background-color: rgba(255, 255, 255, .8);
        bottom: 10px;
        left: 0;
        right: 0;
        text-align: center;
        padding: 75px 0px 50px;
        margin: 0px 10px;
        z-index: 9;
    }
    .testclg1,.testclg2{
        color: rgb(97, 97, 97);
    }
    .nn_block_user .testclg2 svg.nn_blkicon{
        fill: #000;
        width: 16px;
        height: 24px;
        margin-right: 3px;
    }
    .nn_block_user .testclg2 svg{
        width: 20px;
        height: 24px;
        margin-right: 3px;
    }
    .nn_block_user .testclg2 span{
        font-size: 13px;
        font-weight: bold;
        vertical-align: text-top;
    }
    .adminadd{
        padding: 15px;
        /* background-color: rgb(245, 245, 245); */
        text-align: center;
    }
    .adminadd1{
        height: 100% !important;
    }
    .respfile{
        width:100%;
        display: inline-block;
    }
    .comonw{
        width:32%;
        float: left;
    }
    .popfilltegh{
        position: relative;
        overflow-x: auto!important;
        -webkit-overflow-scrolling: touch;
        height: 100%;
    }
    img.goodlnabs{
        max-height:250px;
    }
    .googlemapht{
        min-height:250px;
    }
    @media screen and (min-width: 768px){
        .container{
            width: 750px;
        }
    }
    @media screen and (min-width: 992px){
        .container{
            width: 970px;
        }
        .nn_backarrow{
            display: none;
        }
        #elId{
            display:block!important;
        } 
    }
    @media screen and (min-width: 1200px){
        .container{
            width: 1170px;
        }
    }
    @media screen and (min-width: 1800px){
        .nn_chatreswrapper{
            height: 100vh;
        }
    }
    @media (min-width: 992px) and (max-width: 1200px) {  
        img.goodlnabs{
            width:100%;
            height:250px;
        } 
    }
    @media screen and (max-width: 991px){
        .nn_chatmsg{
            margin-top: 73px;
        }
        .nn_chatmain{
            padding-top: 35px;
        }
        .nn_reschatview,.nn_chatrtmain{
            width: 100%;
        }
        .nn_chatreswrapper{
            display: block!important;
            height: auto !important;
            margin-bottom: 20px;
        }
        .nn_chatrtwrapper.active{
            display: none;
        }
        .nn_chatreswrapper .nn_reschat,.nn_chatreswrapper .nn_reschat .nn_reschatview.active{
            width: 100%;
        }
        .nn_chat_title span{
            font-size: 21px;
        }
        .nn_product_img img{
            margin-left: 0px;
        }
        .nn_chat_back_arrow svg{
            width: 30px;
            height: 24px;
        }
        .nn_backarrow button svg{
            fill: #000 !important;
        }
        .nn_chatbt{
            position: inherit;
        }
        .rtlchatboct{
            height: 500px!important;
        }
        .inpydeanrr{
            margin:0px;
            width:100%;
        }
        #elId{
            display:none;
        }
        .comonw{
            width: 100%;
            border-bottom:1px solid #eee;
        } 
        .righrsidewharr,.hideprodurcha{
            display: none!important;  
        }
    }
    @media screen and (max-width: 991px) and (min-width: 768px){
        img.goodlnabs{
            margin-top:20px;
            width:100%;
        } 
    }
    @media screen and (max-width: 768px){
        .backarrowview{
            display: inline-block;
        }
    } 
    @media screen and (max-width: 767px){
        .nn_chatrtprofile{
            padding: 15px 0px;    
        }
        .nn_chatbtmain,.nn_chatbtctn,.nn_chatinput{
            margin: 10px 5px;
            width:98%;
        }
        .nn_cus_reschatbtctn{
            max-width: 100%;
            overflow: auto;
        }
        .nn_chatsendbtn button img{
            margin-left: 3px;
        }
        .nn_chatrtprofile div{
            padding: 0px 3px;
        }
        .nn_newpdd.isblock{
            bottom: 20px;
            text-align: center;
            padding: 85px 0px 60px;
        }
        .nn_pro_ctn{
            width: 150px;
        }
        .inpydeanrr{
            margin:0px!important;
            width: 100%;
        }
        .cls_homefilter .inpydeanrr{
            padding: 15px 20px;
        }
        .jxllvb.sellres{
            padding:0px!important;
            width:0px!important;
        }
        img.goodlnabs {
            margin-top: 20px;
            width: 100%;
            object-fit: contain;
        }
    }
    `;

// fixed scroll

export const ScrollTop = styled.div`
    .anchor-fixed.cls_loganchor{
        bottom: 75px;
    }
    .anchor-fixed{
        position: fixed;
        bottom: 25px;
        right: 15px;
        width: 45px;
        height: 45px;
        z-index: 9;
        cursor: pointer;
        background: var(--theme-color);
        box-shadow: 0px 1px 3px 2px #ffffff38;
        border: 1px solid var(--subtheme-color);
        border-radius: 50px;
        color:var(--subtheme-color);
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
    }
    @media screen and (max-width: 991px){
        .cls_loganchor{
            bottom: 63px;
        }
    }
    @media screen and (max-width: 768px){
        .cls_loganchor {
            bottom: 75px !important;
            right: 14px !important;
        }
    }
`;

// InnerPage

export const InnerPage = styled.div`
    .nn_inner_page #content .anchor-fixed,.nn_inner_page .anchor-fixed{
        bottom: 65px;
    }
    .nn_inner_page .headermain{
        position: absolute;
    }
    .nn_inner_page #cls_header .headerright .resfilte{
        display: none;
    }
    .nn_inner_page .nn_mob_searchbox{
        display: none;
    }
    .notFoundProduct{
        text-align: center;  
        width: 100%;
        height: 800px;
        padding-top: 150px;
        h5,h6{
            margin: 1em;
        }
    } 
    .logbtnss{   
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;      
        text-overflow: ellipsis;
        font-family: var(--theme-fontfamily);
        color: var(--subtheme-color);
        width: auto;
        line-height:46px;
        font-size: 16px;
        font-weight: 500;
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: var(--theme-color);
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        text-transform: capitalize;
    }
    @media screen and (max-width: 991px){
        .nn_inner_page #content .anchor-fixed,.nn_inner_page .anchor-fixed{
            bottom: 75px;
        } 
        .nn_inner_page .headerright .ressell{
            display: none;
        }              
    }
    @media screen and (max-width: 767px){
        .notFoundProduct{           
            height: 100%;
            padding-top: 0px;            
        } 
    }
`;

// chatBox 

export const ChatBox = styled.div`
    .chatmgn{
        margin-top: 120px !important;   
    }
    .nn_chatboxheader{
        border: 1px solid var(--theme-color);
    }
    .nn_chatboxheader,.nn_chatNow_new .nn_chatboxheader{
        width: 288px;
        position: fixed;
        right: 10px;
        bottom: 0px;
        box-shadow: 1px 1px 3px 0px rgb(149 149 149 / 20%);
        border-radius: 8px 8px 0px 0px;
        z-index: 9;
        background: #fff;
    }
    .nn_chatboxheader .nn_chatboxtitle{
        width: 100%;
        padding: 13px 15px;
        box-shadow: 1px 1px 3px 0px rgb(149 149 149 / 20%);
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        border-bottom: 1px solid var(--theme-color-hvr);
    }
    .gNaiKn{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 97;
        color: white;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        background: rgb(0, 154, 171);
        transition: top 0.5s ease 0s;
    }
    .gNaiKnBl{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        z-index: 97;
        color: white;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        background: rgb(26, 27, 27);
        transition: top 0.5s ease 0s;
    }
    .cVYPhc{
        position: relative;
        padding: 10px;
    }
    .newpdd{
        position: relative;
        margin-bottom: 27px;
    }
    .nn_notification{
        background: var(--theme-color);
        height: 14px;
        width: 14px;
        border-radius: 50px;
        border: 2px solid #fff;
    }
    ul li.bgcolor:hover{
        background-color: rgb(238, 238, 238);
    }
    .boredrradus{
        border-radius: 32px;
    }
    .soldde{
        font-size:12px;
    }
    button.grs{
        padding:8px 12px!important;
    }
    .nn_chatmsg_new .nn_chatleft,.nn_chatmsg_new .nn_chatright{
        display: flex;
    }
    .chatInput{
        margin-top:50px;
    }
    .nn_chatleft img{
        width: 35px;
        height: 35px;
        border-radius: 50%;
        margin-right: 10px;
    }
    .nn_chatleftctn{
        width: 160px;
    }
    .nn_chatleftctn h6{
        font-weight: 600;
        color: #424244;
        font-size: 15px;
        margin-bottom: 0px;
    }
    .nn_chatleft .nn_msg_count_head{
        display: flex;
    }
    .nn_msg_count span{
        padding-right: 10px;
    }
    .nn_chatright ul li{
        color: #757575;
        padding: 0px;
        font-size: 18px;
        margin-left: 10px;
    }

    .nn_chatconver{
        width: 100%;
        height: 315px;
        overflow: auto;
        position: relative;
        background-image: url(${ChatBgImg});
        background-repeat: no-repeat;
        background-position: center;
        background-size: 300px 100%;
    }
    .nn_chatconver .nn_respchar .nn_chatmain{
        cursor: pointer;
        padding: 13px 10px;
        font-family: var(--theme-fontfamily);
        display: flex;
        position: relative;
        justify-content: space-between;
        border-bottom: 1px solid #d4d4d4;
    }
    .nn_chatconver .nn_respchar .nn_chatmain .nn_chatctn{
        display: flex;
        position: relative;
        width: calc(100% - 40px);
    }
    .nn_chatconver .nn_respchar .nn_chatmain .nn_chatctn img,.nn_chatimg img{
        box-shadow: 0px 1px 3px 2px rgba(0,0,0,0.12);
        width: 40px;
        height: 40px;
        border-radius: 50px;
    }
    .nn_chatconver .nn_respchar .nn_chatmain .nn_chatctn .nn_pro_chatctn{
        padding-left: 10px;
    }
    .nn_chatconver .nn_respchar .nn_chatmain .nn_chatctn .nn_pro_chatctn .nn_pro{
        font-weight: 600;
        color: #424244;
    }
    .nn_chatconver .nn_respchar .nn_chatmain .nn_chatctn .nn_pro_chatctn .nn_pro1,.nn_blockuser{
        color: #484848;
    }
    .nn_chatconver .nn_user,.nn_chatconver .nn_block_user{
        padding: 15px 15px 0px;
        overflow-y: auto;
    }
    .nn_blockuser .nn_soldmain{
        position: absolute;
        bottom: 0px;
        left: 8px;
        color: #484848;
        font-size: 12px;
        font-weight: bolder;
    }
    .nn_blockuser svg.nn_blkicon{
        fill: #000;
        color: #000;
        width: 16px;
        height: 16px;
        margin-right: 3px;
    }
    .nn_blockuser .nn_blockctn{
        color: #484848;
        font-size: 12px;
        font-weight: bolder;
    }
    .nn_urgent1_new .nn_buying_color,.nn_urgent1_new .nn_selling_color{
        font-weight: 600;
        font-size: 13px;
    }
    .nn_urgent1_new .nn_buying_color{
        color: #fff;
        background: #f54a61;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 7px;
        font-size: 11px;
    }
    .nn_urgent1_new .nn_selling_color{
        color: #fff;
        background: #34ca34;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 7px;
        font-size: 11px;
    }
    .nn_chatmain .nn_notification{
        background: var(--theme-color);
        height: 24px;
        width: 24px;
        border-radius: 50px;
        border: 2px solid #fff;
        color: var(--subtheme-color);
        position: absolute;
        right: 0px;
        top: 0px;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
    }
    .nn_chatmsg_new .nn_chatboxheader0{
        width: 288px;
        position: fixed;
        right: 310px;
        bottom: 0px;
        box-shadow: rgba(0, 10, 18, 0.26) 0px 0px 16px 0px;
        border-radius: 8px 8px 0px 0px;
        z-index: 9;
        background: #fff;
    }
    .nn_chatmsg_new .nn_chatboxheader1{
        width: 288px;
        position: fixed;
        right: 610px;
        bottom: 0px;
        box-shadow: rgba(0, 10, 18, 0.26) 0px 0px 16px 0px;
        border-radius: 8px 8px 0px 0px;
        z-index: 9;
        background: #fff;
    }
    .nn_chatmsg_new .nn_chatboxheader0 .nn_chatboxtitle,.nn_chatmsg_new .nn_chatboxheader1 .nn_chatboxtitle{
        width: 100%;
        padding: 6px 10px;
        float: left;
        box-shadow: rgba(0, 10, 18, 0.26) 0px 0px 16px 0px;
        border-radius: 8px 8px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        /* margin-bottom: 10px; */
    }

    .nn_chatmsg_new .nn_chatright ul li{
        display: inline-block;
        color: #757575;
        font-size: 16px;
        padding: 0px;
        margin-left: 10px;
        font-weight: 600;
    }
    .nn_chatmsg_new .nn_chatright ul li span{
        padding: 5px;
    }
    .nn_chatmsg_new .nn_chatright ul li span i{
        font-size: 19px;
    }
    .nn_chatmsg_new .nn_chatright ul li .dropdown-menu{
        padding: 5px;
        min-width: 125px;
    }
    .nn_chatmsg_new .nn_chatright ul li .dropdown-menu li{
        margin-left: 0px;
    }
    .nn_chatmsg_new .nn_chatright ul li .dropdown-menu::before{
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #eee;
        top: -13px;
        content: "";
        right: 3px;
        margin-left: -10px;
        position: absolute;
    }
    .nn_chatmsg_new .nn_chatright ul li .dropdown-menu::after{
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #fff;
        top: -10px;
        content: "";
        right: 3px;
        margin-left: -10px;
        position: absolute;
    }
    .nn_chatmsg_new .dropdown-menu.show{
        right: 0!important;
        left: auto!important;
        margin-top: 13px;
        background: #fff;
        text-align: center;
        border: none;
        box-shadow: 0 0 5px #ccc;
    }
    .dropdown-menu.chatbox.selerrtlcss.show{
        padding:0px!important;
    }
    .dropdown-menu.chatbox.selerrtlcss.show ul{
        padding:0px 10px!important;
        width: 200px;
        margin-bottom:0px;
    }
    .dropdown-menu.chatbox.selerrtlcss.show ul:hover{
        color:var(--theme-color);
    }
    .dropdown-menu.chatbox.selerrtlcss.show ul li{
        padding: 10px;
    }
    .nn_chatmsg_new .nn_chatconver{
        overflow: auto;
        width: 100%;
        height: 270px;
        background-image: url(${ChatBgImg});
        box-shadow: 0px 0px 4px #cccc;
    }
    .nn_chatmsg_new .nn_senderpart{
        padding: 5px 0px;
        text-align: left;
        width: 100%;
        position: relative;
        margin-right: 0;
        float: left;
    }
    .nn_chatmsg_new .nn_receivepart{
        padding: 5px 0px;
        text-align: right;
        width: 100%;
        position: relative;
        margin-right: 0;
        float: left;
    }
    .nn_chatmsg_new .nn_senderpart .nn_chatmsgctn{
        width: auto!important;
        max-width: 50%;
        min-height: 55px;
        background: transparent;
        max-width: 80%;
        border-radius: 0px;
        overflow: hidden;
        float: right;
        /* padding: 10px 12px; */
        color: #424242;
        text-align: right;
        word-break: break-word;
    }
    .nn_chatmsg_new .nn_receivepart .nn_chatmsgctn{
        width: auto!important;
        max-width: 50%;
        min-height: 55px;
        background: transparent;
        max-width: 80%;
        border-radius: 0px;
        overflow: hidden;
        float: left;
        /* padding: 10px 12px; */
        color: #424242;
        text-align: left;
        word-break: break-word;
    }  
    .nn_chatmsg_new .nn_receivepart .nn_chatmsgctn .nn_nortltrans,.nn_receivepart .nn_chatmsgctn .rtltranschat{
        background-color:  var(--theme-color-hvr);
        color: var(--subtheme-color);
        padding: 6px 20px;
        border-radius:  5px 20px 5px;
        font-size: 14px;
        font-weight: 500;
    }
    .nn_chatmsg_new .nn_senderpart .nn_chatmsgctn .nn_nortltrans,.nn_senderpart .nn_chatmsgctn .rtltranschat{   
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        padding: 6px 20px;
        border-radius:  5px 20px 5px;
        font-size: 14px;
        font-weight: 500;
    }
    .nn_dateseen{
        font-size: 11px;
        color: #616161;
        padding: 0 10px;
    }
    .nn_sendctn{
        display: inline-flex;
        width: 100%;
        border-top: 1px solid rgb(221, 221, 221);
        background-color: #eeeeee;
    }
    .nn_sendbtn{
        padding: 5px 0px;
        margin-left: 5px;
        border-left: 1px solid #ddd;
        padding-right: 5px;
        position: relative;
    }
    .nn_sendctn input{
        border: none;
        padding: 10px;
        background: #eee;
        width: 100%;
    }
    .nn_sendctn input:focus{
        outline: none;
    }
    .nn_sendctn .nn_sendbtn button{
        border: 1px solid var(--theme-color);
        color: var(--theme-color);
        background: #fff;
        font-size: 16px;
        font-weight: 500;
        padding: 0px 15px;
    }
    .nn_sendctn .nn_sendbtn button:hover,.nn_sendctn .nn_sendbtn button:focus{
        color: var(--subtheme-color);
        background: var(--theme-color);
    }
    .nn_sendctn .nn_blkctn{
        background-color: rgba(255, 255, 255, .8);
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 9;
        padding: 10px 0px;
    }
    @media screen and (max-width: 991px){
        .nn_chatboxheader{
            display: none;
        }
        .chatmgn{
            margin-bottom: 30px;
        }
        .chatreswrapper{
            overflow: unset;
        }
    }
    @media (min-width: 769px) and (max-width: 991px) {            
        .chatmgn{
            margin-left:20px;
            margin-right:20px;
        }
    }
    @media screen and (max-width: 768px){
        .loginRight{
            display: block;
            width: 100%;
        }
        .dropdown-menu.chatbox.selerrtlcss.show {
            transform: translate3d(-16px, 50px, 0px)!important;
            z-index: 1;
        }
    }
    @media screen and (max-width: 767px){
        .chatmgn{
            margin-top: 100px !important;
            margin-bottom: 30px;
        }
    }
`;

// EditProfile

export const EditProfileMain = styled.div`
    .nn_edit_profile{
        background-color: #f6f5f7;
        margin-top: 0px;
        padding: 50px 0px;
    }
    .nn_wrapperedit{
        padding: 0px 20px;
        width: auto;
        margin:0 auto;
    }
    .nn_edit_promain{
        width: 100%;   
    }   
    .nn_tabs_nav{
        background-color: #fff;
    }
    .nn_edit_pro_main{
        padding: 20px;
        text-align: center;
        position: relative;
    }
    .nn_edit_pro_img img{
        width: 100px;
        height: 100px;
        text-align: center;
        margin: 0 auto;
        border-radius: 50px;
        border: 1px solid #ddd;
    }
    .nn_edit_pro_ctn{
        margin-top: 15px;
    }
    .nn_edit_pro_ctn h4{
        font-size: 20px;
        font-weight: bold;
    }
    .nn_edit_profileicon{
        position: absolute;
        top: 20px;
        right: 35%;
        cursor: pointer;
    }
    .nn_edit_profileicon p span{
        box-shadow: -1px 3px 10px 0px rgba(0, 0, 0, 0.35);
        background-color: #fff;
        padding: 5px;
        display: inline;
        border-radius: 50px;
    }
    .nn_edit_profileicon p span svg{
        fill: var(--theme-color);
        font-size: 14px;
        width: 18px;
        height: 18px;
    }    
    .border-bottomline{
        width: 100%;
        float: left;
        border-bottom:1px solid #f3ebeb;
    }
    .reporreve.rvwrtl.show .dropdown-menu.show{
        right: -30px !important;
        top: -5px !important;
    }    
    .leftimgrev{
        width:78%;
        float: left;
        margin-left:2%;
        margin-bottom: 20px;
    }
    .leftimgrev.seller{
        width:83%!important;
    }
    .leftimgrev.seller .dv-star-rating{
        pointer-events: none;
    }
    .btn1-sm {
        background-color: #f53a56;
        color: #FFF;
        display: inline-block;
        padding: 0 12px;
        border-radius: 25px;
        font-size: 14px;
    }
    .icon_bg {
        background-color: #FFF;
        border-radius: 24px;
        padding: 4px 1px;
    }
    .nn_tabs_nav .nav{
        display: block;
        width: 100%;
    }
    .nn_tabs_nav .nav a{
        display: block;
        text-align: left !important;
        border-top: 1px solid #eee !important;
        font-size: 16px;
        font-weight: 600;
        padding: 15px;
        color: #000;
    }  
    .nn_tabs_nav .nav a.active,.nn_tabs_nav .nav a:focus{
        color: var(--theme-color);
    }
    .nn_tabs_nav #nav-tab  a:focus,.nn_tabs_nav #nav-tab  a.active{
        border-top: 1px solid #eee !important;
        border-bottom: 0px solid transparent !important;
    }
    .nn_tabs_nav #nav-tab a.active,.nn_tabs_nav #nav-tab a:hover,.nn_tabs_nav .nav a:focus{
        color: var(--theme-color);
        background-color: #fbfbfb;
    }
    .nn_tab_ctn{
        background-color: #fff;
        margin-left: 10px;
        padding: 20px 0px;
    }
    .nn_edit_sellpromain{
        height: 100%;
        min-height: 500px;
    }
    .nn_edit_sellpromain .nn_edit_proname{
        padding: 5px 20px 15px;
        display: block;
        border-bottom: 1px solid #eee;
        font-size: 20px;
        font-weight: bold;
    }
    .nn_loadmore{
        width: 100%;
        padding: 35px 0px;
    }
    .nn_loadmore .nn_loadbtn{
        margin: 0 auto;
        display: block;
        background:  var(--theme-color);
        color: var(--subtheme-color);
        border: none;
        padding: 8px 30px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: 600;
    }
    .nn_edit_sellpro{
        padding: 20px;
    }
    .nn_edit_allproducts{
        display: inline-block;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .nn_empty_tab{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }
    .nn_empty_tab p{
        font-size: 16px;
        color: #585656;
        text-align: center;
    }
    .nn_empty_tab p span{
        font-size: 18px;
        font-weight: 600;
        color: var(--theme-color);
    }
    .nn_edit_allproducts .nn_edit_proctn{
        display: inline-block;
        width: Calc(100% / 4);
        border-radius: 8px;
        position: relative;
        padding: 10px;
    }
    .nn_edit_proctn .nn_edit_prosection,.nn_edit_proctn .bgcolor{
        background-color: #fff;
        box-shadow: 0px 1px 10px 0px rgba(0,0,0,0.12);
        border-radius: 8px;
    }
    .nn_edit_proctn .nn_edit_prosection a,.nn_edit_proctn .bgcolor a{
        text-decoration: none;
    }
    .nn_edit_proctn .nn_edit_prosection a .inner,.nn_edit_proctn .bgcolor a .inner{
        height: 200px;
        width: 100%;
        overflow: hidden;
    }
    .nn_edit_proctn .nn_edit_prosection a .inner img,.nn_edit_proctn .bgcolor a .inner img{
        height: 100%;
        width: 100%;
        border-radius: 8px 8px 0px 0px;
        object-fit: cover;
        transition: all .3s;
    }
    .nn_edit_proctn .nn_edit_prosection a .inner:hover img,.nn_edit_proctn .bgcolor a .inner:hover img{
        transform: scale(1.2);
    }
    .nn_edit_proctn .nn_edit_prosection a .inner .freeproduct,.nn_edit_proctn .bgcolor a .inner .freeproduct{
        background: var(--theme-color);
        color: var(--subtheme-color);
        display: inline-block;
        position: absolute;
        left: 10px;
        top: 10px;
        padding: 3px 10px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 0px 20px 20px 0px;
    }
    .nn_edit_proctn .nn_edit_prosection a .inner .featured,.nn_edit_proctn .bgcolor a .inner .featured{
        background: var(--theme-color);
        color: var(--subtheme-color);
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 10px;
        padding: 3px 10px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 20px 8px 0px 20px;
    }
    .nn_edit_prosection .nn_order_title{
        text-align: center;
        font-size: 14px;
        color: #000;
        margin-top: 10px;
    }
    .nn_edit_prosection .nn_order_title h6{        
        font-weight: bold;
    }
    .nn_edit_prosection .nn_order_title span{        
        color: #424242;
    }
    .nn_edit_allproducts .nn_edit_orderproctn{
        background-color: #f1f3f5;
        width: 100%;
        margin-bottom: 20px;
    }
    .nn_order_produ1{
        font-size: 16px;
        color: #000;
        display: inline-block;
    }
    .nn_order_produ1 h6{
        font-size: 16px;
        color: #000;
        font-weight: bold;
        padding-top: 10px;
    }
    .nn_order_status{
        padding: 15px;
        border-bottom: 1px solid #ddd;
    }
    .nn_order_moreinfo .nn_order_moreinfoctn{
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
    }
    .nn_order_moreinfo .nn_nextarrow,.nn_order_moreinfo .nn_previousarrow{
        font-size: 24px;
        vertical-align: top;
    }
    .nn_order_total,.nn_order_total1{
        background-color: #e8ecf0;               
        padding: 15px;
    }
    .nn_order_total{
        display: block;
        text-align: right;
    }
    .nn_order_total1{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .nn_order_total p,.nn_order_total1 p{
        font-size: 16px;
        font-weight: bold;
        color: #000;
        margin: 0;
    }
    .nn_order_total span,.nn_order_total1 span{
        font-size: 16px;
        font-weight: 500;
        color: #000;
    }
    .nn_edit_orderproctn a{
        text-decoration: none;
    }
    .nn_edit_orderproctn .nn_edit_prosection,.nn_edit_orderproctn .bgcolor{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 15px;
    }
    .nn_edit_orderproctn .nn_edit_prosection a .inner img,.nn_edit_orderproctn .bgcolor a .inner img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }
    .nn_orderstsctn p{
        color: #000;
        font-size: 16px;
        font-weight: 700;
    }
    .nn_orderstsctn p span,.nn_order_details table tr td.nn_status{
        color: var(--theme-color);
        font-size: 16px;
        font-weight: 500;
        margin-left: 5px;
    }
    .nn_order_total p,.nn_orderstsctn p,.nn_order_derails p{
        margin-bottom: 0px;
    }
    .nn_order_derails .nn_order_on p{
        font-size: 14px;
    }
    .nn_order_derails .nn_order_id p{
        border: 1px solid #000;
        padding: 5px 15px;
        border-radius: 3px;
        display: inline-block;
        font-size: 14px;
        min-width: 145px;
    }
    .nn_order_derails p,.nn_order_derails button{
        padding: 8px 0px;
        margin: 0px 0px 10px;
    }
    .nn_order_derails .nn_order_cancel button,.nn_order_derails button{
        background-color: #464e55;
        color: #fff;
        padding: 8px 20px;
        border-radius: 3px;
        font-size: 14px;
        min-width: 145px;
    }
    .nn_order_details{
        border-top: 1px solid #ddd;
        padding: 20px;
    }
    .nn_order_details table tr{
        width: 20%;
    }
    .nn_order_details table tr th{
        color: #636464;
    }
    .nn_order_details table tr td{
        color: #686666;
    }
    .nn_order_details table tr:nth-child(2) td,.nn_order_details table tr:nth-child(4) td{
        padding-bottom: 10px;
    }
    .nn_order_details table tr td:last-child,.nn_order_details table tr th:last-child{
        border-right: 0px solid #fff;
    }
    .nn_order_details table tr td,.nn_order_details table tr th{
        border-right: 1px solid #ddd;
        padding-left: 20px;
        vertical-align: baseline;
        width: 15%;
    }
    .nn_shipping_address{
        width: 27% !important;
    }
    .nn_shipping_address span{
        display: block;
        word-break: break-word;
        white-space: pre-wrap;
    }
    .nn_edit_backarrow{
        position: absolute;
        top: 10px;
        left: 15px;
    }
    .nn_edit_backarrow button svg,.nn_edit_backarrow1 button svg{ 
        fill: #000;
        color: #000;
    }
    .nn_btn{
        color: var(--subtheme-color);
    }
    .nn_edit_icons{
        display: flex;
        align-items: center;
        justify-content: space-between;    
        width: 90%;
    }
    .nn_edit_backarrow1{
        position: absolute;
        top: 10px;
        left: 15px;
    }
    .nn_seller_dropdown{
        position: absolute;
        top: 20px;
        right: 15px;
    }
    .nn_seller_dropdown .dropdown.show{
        text-align: right;
        cursor: pointer;
    }
    .nn_seller_dropdown .dropdown-menu.nn_dropdown_menu{
        top: -11px !important;
        position: relative !important;
    }
    .nn_seller_dropdown .dropdown-toggle::after{
        display: none;
    }
    .dropdown-menu.nn_dropdown_menu.show{
        padding: 0px !important;
    }
    .nn_dropdown_menu div{
        padding: 5px;
    }
    .nn_dropdown_menu ul li{
        padding: 5px 10px;
        font-weight: 500;
        font-size: 15px;
    }
    .nn_dropdown_menu ul li:hover{
        background-color: #f8f9fa;
    }        
    .rightPart{
        width: 25%;
        text-align: right;
        padding-right: 30px;
        color: rgb(189, 189, 189);
        line-height: 50px;
        font-size: 24px;
    }
    .footer{
        padding: 15px;
    }
    .foot-produ h6{
        color: rgb(44, 44, 44);
        font-weight: bold;
        margin-top: 10px;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .foot-produ p{
        color: rgb(117, 117, 117);
        line-height: 1.2em;
        font-weight: 500;
        font-size: 16px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0px;
    }
    .dv-star-rating label{
        font-size:15px;
        color: var(--theme-color) !important;
    }
    .bgcolor {
        color: black;
    }
    .reusewraye a{
        color:#212529;
    }
    .reviwuser{
        width:100%;        
    }
    .reusewraye{
        width:100%;
        float: left;
        margin-bottom: 20px;
    }
    .wholereviewwr{
        width: 15%;
        float: left;
    }
    .wholereviewwr img{
        width: 100px;
        border-radius: 50%;
        height: 100px;
    }
    .desrev p{
        margin-bottom:0px;
        font-size:16px;
    }
    .reporreve{
        width:5%;
        float: left;
        position: relative;
    }
    .reporreve .dropdown-menu.show{
        cursor: pointer;
        right: -10px;
        left: inherit !important;
        filter: drop-shadow(rgba(0, 0, 0, 0.2) 0px 1px 8px);
        text-align: center;
        border:none;
    }
    .reporreve .dropdown-toggle::after{
        border:none;
    }
    .reporreve button{
        font-size: 24px;
        color: #000;
    }
    .reporreve button:focus{
        box-shadow: none;
    }
    .adminadd{
        padding: 15px;
        /* background-color: rgb(245, 245, 245); */
        text-align: center;
    }
    .adminadd1{
        height: 100% !important;
    }
    .cls_addpayout
    {
        color: var(--subtheme-color);
        background-color: var(--theme-color);
        padding: 8px 30px;
        border-radius: 3px;
    }
    
    @media  (min-width: 768px){
        .nn_order_produ1{
            padding-left: 15px;
        }
    }
    @media (min-width: 992px){
        .nn_edit_backarrow,.nn_edit_backarrow1{
            display: none;
        }
    }
    @media (min-width: 1200px)  {
        body.ReactModal__Body--open{
            overflow-y: hidden!important;
        }         
        .nn_edit_profileicon{       
            right: 37%;
        }
    }   
    @media screen and (max-width:1023px) and (min-width: 768px){
        .nn_edit_profileicon{       
            right: 44%;
        }
        .nn_edit_allproducts .nn_edit_proctn{
            width: 100%;
        }
    }
    @media screen and (max-width: 991px){
        .reporreve.rvwrtl.show .dropdown-menu.show{
            right: -70px !important;
            top: -5px !important;
        }
    }
    @media screen and (max-width:768px){
        .nn_edit_allproducts .nn_edit_proctn{
            width: calc(100% / 2);
        }        
        .nn_edit_orderproctn .bgcolor{
            text-align: center;
        }
    }
    @media screen and (max-width:767px){
        .nn_wrapperedit{
            padding: 0px 10px;
            width: 100%;
        }
        .nn_edit_profile{
            padding: 15px 0px;
        }
        .nn_tab_ctn{
            margin-left: 0px;
            margin-top: 15px;
        }   
        .nn_order_details{
            padding:10px 5px;
        }
        .nn_order_details table tr td, .nn_order_details table tr th{
            padding: 0px 5px;
            width: 25%;
        }
        .leftimgrev,.leftimgrev.seller{
            width: 60%!important;
            margin-left: 2%!important;
        }         
        .wholereviewwr{
            width: 25%!important;
        }
        .wholereviewwr img{
            width:85px!important;
            height:85px!important;
        } 
        .Toastify__toast-container--bottom-center{
            margin-left:0px!important;
            left:0px!important;
        }
        .Toastify__toast-container{
            width: 100vw!important;
        }
        .rightPart.selledreight{
            position: absolute;
            width:100%;
            padding-right:0px!important;
        }
        .nn_order_produ1{
            text-align: center;
            display: block;
        }
        .reporreve.rvwrtl.show .dropdown-menu.show{
            right: -80px !important;
            top: -5px !important;
        }
    }   
    @media (min-width: 320px) and (max-width: 425px) {
        .nn_edit_allproducts .nn_edit_proctn{
            width: 100%;
        }

    }
    @media (min-width: 320px) and (max-width: 380px) {
        .wholereviewwr{
            width: 25%!important;
        }
        .wholereviewwr img{
            width:50px!important;
            height:50px!important;
        }       
    }
`;

// ProductDetails

export const ProductDetailsMain = styled.div`
    .nn_productdetails{
        padding-top: 50px;
        padding-bottom: 0px;
        margin-top: 71px;
    }
    .pos_rel{
        position: relative;
    }
    .cardts{
        width: 100%;
        float: left;  
    }
    .cardts h6{
        font-size: 15px;
        color: rgb(66, 66, 66);
        font-weight: 500;
    }
    .dropdown-item{
        cursor: pointer;
    }
    .nn_product_list .slick-prev{
        left: -10px;
        top: 40% !important;
    }
    .App-testimonial-count{
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: rgba(33, 33, 33, 0.3);
        font-size: 14px;
        color: white;
        padding: 4px 8px;
        border-radius: 500em;
        transition: opacity 0.2s linear 0s;
    }
    .nn_dropdn .dropdown-toggle:focus{
        outline: none !important;
        box-shadow: none !important;    
    }
    .iDhWYa{
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        font-family: var(--theme-fontfamily);
        width: 100%;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-color);
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: white;
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        border-color: var(--theme-color);
        border-width: 1px;
        border-style: solid;
    }
    .iDhWYa:hover{
        color: var(--subtheme-color);
        background-color: rgb(255, 216, 220);
    }
    .bottsnn{
        position: relative;
        width: 100%;
        float: left;
        min-height: 100%;
    }
    .Nounderline:hover,
    .Nounderline:active
    .Nounderline:focus,
    .Nounderline:focus-within{
        outline: none!important;
        border: none!important;
        color: none!important;
    }
    .featureadd{
        position: relative;
    }
    .product-right{
        width: 100%;
        float: left;
    }
    .nn_product_list .slick-slider .slick-dots{
        display: none !important;
    }
    .product-list .slick-prev{
        background-image: url(../../../assets/img/arrow-down-white.png);
        transform: rotate(90deg);
        z-index: 1;
    }
    .product-list .slick-prev::before{
        content:"";
    }
    .product-list .slick-next::before{
        content:"";
    }
    .product-list .slick-next{
        background-image: url(../../../assets/img/arrow-down-white.png);
        transform: rotate(265deg);
    }
    .product-list .slick-next, .slick-prev{
        top:40%!important;
        width: 40px!important;
        background-size: 40%;
        height: 40px !important;
        background-color:rgba(33, 33, 33, 0.3);
        border-radius: 50%;
        background-repeat: no-repeat !important;
        background-position: center;
        text-align: center;
    }
    .product-list .slick-prev:focus, .slick-prev:hover{
        background-color: rgba(33, 33, 33, 0.3);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 40%;
    }
    section.safetytips h1{
        display: none;
    }
    .product-list .slick-next{
        right:0px!important;
    }
    .product-list .slick-prev{
        left: 0px!important;
    }   
    .nn_product_list .slick-next{
        right: -10px;
    }
    .product-left .urgent{
        left:0px!important;
        top:50px;
        border-radius:0px;
    }
    .nn_product_bg{
        background-color: #f2f2f2;
        padding: 0px;
        margin: 0px 0px 0px 50px;
        box-shadow: 0px 0px 38px -15px #988989;
        border-radius: 10px;
        position: relative;
    }
    .nn_product_bg img{
        width:100%;
        height:500px;
        object-fit:cover;
        border-radius: 10px;
    }
    .ribbon {
        position: absolute;
        right: -5px;
        top: -5px;
        z-index: 1;
        width: 75px;
        height: 75px;
        text-align: right;
        overflow: hidden;
    }
    .ribbon > div {
        font-size: 12px;
        color: var(--subtheme-color);
        background-color: var(--theme-color);
        font-weight: bold;
        text-align: center;
        line-height: 20px;
        transform: rotate(45deg);
        width: 100px;
        display: block;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
        position: absolute;
        top: 20px;
        right: -20px;
    }
    .ribbon > div::before, .ribbon > div::after{
        position: absolute;
        content: "";
        top: 100%;
        z-index: -1;
    }
    .ribbon > div::before {
        left: 0px;
        border-left: 2px solid rgb(148, 148, 148);
        border-right: 2px solid transparent;
        border-bottom: 2px solid transparent;
        border-top: 2px solid rgb(148, 148, 148);
    }
    .ribbon > div::after {
        right: 0px;
        border-left: 2px solid transparent;
        border-right: 2px solid rgb(148, 148, 148);
        border-bottom: 2px solid transparent;
        border-top: 2px solid rgb(148, 148, 148);
    }
    .nn_product_bg.product-left .slick-prev
    {
        top: 50% !important;        
        z-index: 1;
        left: -45px;
        /* background-image: url(../../../assets/img/pr2.png);   */
        background-position: center;
    }
    .nn_product_bg.product-left .slick-next
    {
        top: 50% !important;
        right: -45px;
        z-index: 1;
        /* background-image: url(../../../assets/img/pr1.png); */
        background-position: center;
    }
    .product-left .slick-prev::before{
        content:"";
    }
    .product-left .slick-next::before{
        content:"";
    }
    .product-left  .slick-next, .slick-prev{
        top:88%!important;
        width: 40px!important;
        background-size: 60%;
        height: 40px !important;
        background-color:rgba(33, 33, 33, 0.3);
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        text-align: center;
    }
    .product-left .slick-dots li.slick-active button:before,.product-left .slick-dots li button::before {        
        opacity: 1;        
    }

    .product-left .slick-dots li.slick-active button:before{
        font-size: 14px;      
        color: var(--subtheme-color);
    }
    .product-left .slick-dots li button::before {
        font-size: 10px;
        color: var(--theme-color-hvr);         
    }   
    .product-left .slick-dots li{
        margin: 0px!important;
    }
    .product-left button.slick-arrow.slick-prev{
        background-size: 60%;
    }
    .product-left .slick-next:before, .slick-prev:before{
        color:rgb(33, 33, 33, 0.3)!important;    
    }
    .product-left .slick-next:focus, .slick-next:hover, .slick-prev:focus, .slick-prev:hover{
        background-color: rgba(33, 33, 33, 0.3);
    }
    .nn_product_bg.product-left .slick-next.slick-disabled,.nn_product_bg.product-left .slick-prev.slick-disabled{
        display: none !important;
    }
    .product-left .slick-prev.slick-disabled:hover, .product-left  .slick-prev.slick-disabled:focus,
    .product-left  .slick-next.slick-disabled:hover, .product-left  .slick-next.slick-disabled:focus,
    .nn_product_list .slick-prev.slick-disabled:hover, .nn_product_list  .slick-prev.slick-disabled:focus,
    .nn_product_list  .slick-next.slick-disabled:hover, .nn_product_list  .slick-next.slick-disabled:focus{
        color: transparent;
        outline: none;
        background: transparent;
    }
    .product-left  .slick-next,.product-left  .slick-next:hover, .product-left  .slick-next:focus{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAC+UlEQVR4Xu3bvWpUQRwF8HPubLQyWAhRrBREVNDayi6FTUQJgiKipZBC8QF8AS0kYmdAFCEoYqEg8QPzADYWij6HSNw7e+SuCSyyhpn9mPsfMlufO3fmt2cvs7MsUV7BAgxOliAKVkQJClbBihCIiJZmFawIgYhoaVbBihCIiJZmFawIgYho8mZJmuvVvdusOA9hD4DvBFfgsEpSEXNPHk2Kpd86pUpvAcz9u1JBzypXXSXZTa4QeMNkWJJ2y+srgEPbzO0lHS9aBUuHVeuSoKcBb6JZsGRYvuvvkbwZgNVETIKlxLpL8lYglkmwZFiqtShoNQLLHFg6LGlGtb6AOJorWDKsBkjScXl9ArAvR7CkWJtgx+T1AcD+SLDXdLxAciPyuonFk2P1wTZ0Uk7vR2hYq2CtYOUK1hpWjmCtYuUG1jpWTmAmsHIBM4OVA5gpLOtg5rAsg5nEsgpmFssimGksa2DmsSyBZYHVB/v7y9C72C/fglZcx12fxNFDNljjgFE8wxmujwuWFdaoYIKWXcct7TisPlit84JeRCz+VdWpzkXkh0bza5Z0RF4fARwMXbygh67jboTm/5fLCksjQDULpzjPGa7tGKxRoQA8rzrV4rhQffRJDDLtMcaAWqfjWZI/JzFH81hWoMw3yxKUaSxrUGaxLEKZxBoDao2OCyR/TeJhPmwMUw94y1CmmmUdygxWDlAmsHKBah0rJ6hWsXKDag0rR6hWsHKFSo4l6bC8mrPw4IO7zc3h1DecIRvZZJtSSbvU02cIJ0ImNpAxAZW0Wap1TdCjXKGSYvnaPyZ4JQLLTKO25pzsY+hr/4Tg5UAsc1BJmyWvJUn3A7BMQqXFkmbl9Q3AgW3AzEIlxWpupq5Oi3oDYO8QsOYPAYvTPI8KaPW2kWTPrK1ZNHutnu/dIbgAYBbCD1ZcRoUHJP24C5rm9cmxBhcjyVkHGpxvq1jTbME0xi5YEaoFq2BFCERES7MKVoRARLQ0q2BFCERES7MKVoRARPQPK7bHW1FpeDwAAAAASUVORK5CYII=);
        background-size: 60%;
        background-repeat: no-repeat;
        background-position: center;
    }
    .nn_product_list  .slick-next:hover, .nn_product_list  .slick-next:focus,.nn_product_list  .slick-next{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAC+UlEQVR4Xu3bvWpUQRwF8HPubLQyWAhRrBREVNDayi6FTUQJgiKipZBC8QF8AS0kYmdAFCEoYqEg8QPzADYWij6HSNw7e+SuCSyyhpn9mPsfMlufO3fmt2cvs7MsUV7BAgxOliAKVkQJClbBihCIiJZmFawIgYhoaVbBihCIiJZmFawIgYho8mZJmuvVvdusOA9hD4DvBFfgsEpSEXNPHk2Kpd86pUpvAcz9u1JBzypXXSXZTa4QeMNkWJJ2y+srgEPbzO0lHS9aBUuHVeuSoKcBb6JZsGRYvuvvkbwZgNVETIKlxLpL8lYglkmwZFiqtShoNQLLHFg6LGlGtb6AOJorWDKsBkjScXl9ArAvR7CkWJtgx+T1AcD+SLDXdLxAciPyuonFk2P1wTZ0Uk7vR2hYq2CtYOUK1hpWjmCtYuUG1jpWTmAmsHIBM4OVA5gpLOtg5rAsg5nEsgpmFssimGksa2DmsSyBZYHVB/v7y9C72C/fglZcx12fxNFDNljjgFE8wxmujwuWFdaoYIKWXcct7TisPlit84JeRCz+VdWpzkXkh0bza5Z0RF4fARwMXbygh67jboTm/5fLCksjQDULpzjPGa7tGKxRoQA8rzrV4rhQffRJDDLtMcaAWqfjWZI/JzFH81hWoMw3yxKUaSxrUGaxLEKZxBoDao2OCyR/TeJhPmwMUw94y1CmmmUdygxWDlAmsHKBah0rJ6hWsXKDag0rR6hWsHKFSo4l6bC8mrPw4IO7zc3h1DecIRvZZJtSSbvU02cIJ0ImNpAxAZW0Wap1TdCjXKGSYvnaPyZ4JQLLTKO25pzsY+hr/4Tg5UAsc1BJmyWvJUn3A7BMQqXFkmbl9Q3AgW3AzEIlxWpupq5Oi3oDYO8QsOYPAYvTPI8KaPW2kWTPrK1ZNHutnu/dIbgAYBbCD1ZcRoUHJP24C5rm9cmxBhcjyVkHGpxvq1jTbME0xi5YEaoFq2BFCERES7MKVoRARLQ0q2BFCERES7MKVoRARPQPK7bHW1FpeDwAAAAASUVORK5CYII=);
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        transform: rotate(0deg);
    }
    .product-left  .slick-prev,.product-left  .slick-prev:hover, .product-left  .slick-prev:focus{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAADBklEQVR4Xu3bO49OQRwG8Oc5s2xE4bYEG5FQUGxDwSdQSGhEaEh8AkHFR9C5NOqloBLJkojbB9BsIhpqRCQiNHbznveR3T0ascn858y5vHPm1M9M5v/Lf/K+5zJEvrwF6J3MQWQsQxNkrIxlEDBEc2dlLIOAIZo7K2MZBAzR3FkZyyBgiPaysyRtxRiXJZ0AMC3oXTEu7nIjFw21RY/2DktLmpPTAoD9/1RbkrxGxzvRFTwn7BVWBfUawM511i+CpznFp571RY31BssDaq1wYrFwxZGoCp6T9QLLG6oqio47SH73rDFarHOsCuoVgF2+VdFxL8kvvvlYuU6xQqAAfKLjPpKKheA7T2dYgVAgeZWOt3wLjJnrBCsUCsBjOp4lOY6J4DtX61iSDqvUGwC7fRdZ5Z7R8QzJJeO4aPFWsSYZau1fS0vXpEO1hpUCVCtYqUA1jpUSVKNYqUE1hpUiVCNYqUJFx0oZKipW6lDRsIYAFQVrKFC1sYYEVQtL0qxKvQWwx3h7+YSO50guG8d1Hg++kS5H5TzBi8YKJhYquLMkTanUDwCbDVgTDVUHa0alvhmgPtPxIMnfhjG9iwZtw6qzfgLY5FuRoAeFKy6RLH3H9C0XhLVSRDkqHxI8bylo0sGCsSQdqH4Ntw8FLBhrBUjLOqpCLwBYwR4VrrhAcmSB7jpbC2toYLWxhgQWBWsoYNGwhgAWFSt1sOhYKYM1gpUqWGNYKYI1ipUaWONYKYG1gpUKWGtYKYC1ijXpYK1jVWDHVeg5gC2WJwmC5qsHiK1/qRz8WNlS4HpZLSsIjOQVOt6OsQbrHJ101t9FBoJ9rQ4NtP7FcqdYoVuSjodIfrB2Rt1851ghYCw5x2m+r1u8dXwvsIxgv+g408Ub7d5g+YJJuuk2uOvWroiR7xVWBXZMxepJ1v8d0HxJx1NdnbLoHdYqmDQ7Lsc3CJ4EsA3AR5L3UeBel2+EeokVY8s0MUfGMqhmrIxlEDBEc2dlLIOAIZo7K2MZBAzR3FkZyyBgiObOMmD9ATJ73lutFJpSAAAAAElFTkSuQmCC);
        background-size: 60%;
        background-repeat: no-repeat;
        background-position: center;
    }
    .nn_product_list  .slick-prev:hover, .nn_product_list  .slick-prev:focus,.nn_product_list  .slick-prev{
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAADBklEQVR4Xu3bO49OQRwG8Oc5s2xE4bYEG5FQUGxDwSdQSGhEaEh8AkHFR9C5NOqloBLJkojbB9BsIhpqRCQiNHbznveR3T0ascn858y5vHPm1M9M5v/Lf/K+5zJEvrwF6J3MQWQsQxNkrIxlEDBEc2dlLIOAIZo7K2MZBAzR3FkZyyBgiPaysyRtxRiXJZ0AMC3oXTEu7nIjFw21RY/2DktLmpPTAoD9/1RbkrxGxzvRFTwn7BVWBfUawM511i+CpznFp571RY31BssDaq1wYrFwxZGoCp6T9QLLG6oqio47SH73rDFarHOsCuoVgF2+VdFxL8kvvvlYuU6xQqAAfKLjPpKKheA7T2dYgVAgeZWOt3wLjJnrBCsUCsBjOp4lOY6J4DtX61iSDqvUGwC7fRdZ5Z7R8QzJJeO4aPFWsSYZau1fS0vXpEO1hpUCVCtYqUA1jpUSVKNYqUE1hpUiVCNYqUJFx0oZKipW6lDRsIYAFQVrKFC1sYYEVQtL0qxKvQWwx3h7+YSO50guG8d1Hg++kS5H5TzBi8YKJhYquLMkTanUDwCbDVgTDVUHa0alvhmgPtPxIMnfhjG9iwZtw6qzfgLY5FuRoAeFKy6RLH3H9C0XhLVSRDkqHxI8bylo0sGCsSQdqH4Ntw8FLBhrBUjLOqpCLwBYwR4VrrhAcmSB7jpbC2toYLWxhgQWBWsoYNGwhgAWFSt1sOhYKYM1gpUqWGNYKYI1ipUaWONYKYG1gpUKWGtYKYC1ijXpYK1jVWDHVeg5gC2WJwmC5qsHiK1/qRz8WNlS4HpZLSsIjOQVOt6OsQbrHJ101t9FBoJ9rQ4NtP7FcqdYoVuSjodIfrB2Rt1851ghYCw5x2m+r1u8dXwvsIxgv+g408Ub7d5g+YJJuuk2uOvWroiR7xVWBXZMxepJ1v8d0HxJx1NdnbLoHdYqmDQ7Lsc3CJ4EsA3AR5L3UeBel2+EeokVY8s0MUfGMqhmrIxlEDBEc2dlLIOAIZo7K2MZBAzR3FkZyyBgiObOMmD9ATJ73lutFJpSAAAAAElFTkSuQmCC);
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        transform: rotate(0deg);
    }
    .nn_productdetails .nn_gridcontainer{
        display: inline-block !important;
    }
    .nn_productdetails .nn_prodetailsctn{
        padding: 0px 25px;
    }
    .nn_productdetails .nn_prodetailsctn .nn_backarrow button svg{
        color: #232323;
        z-index: 9;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum span:nth-child(odd){
        cursor: pointer;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        background: #f2f2f2;
        padding: 5px 15px;
        border-radius: 10px;
        box-shadow: 0px 0px 3px 1px rgba(0,0,0,0.12);
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_bredcum,.nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_bretitle{
        font-size: 15px;
        font-weight: 500;
        color: rgb(97, 97, 97);
    }
    .nn_bredslash{
        margin: 0px 5px;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_bredcum:hover,
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_bretitle:hover{
        color: var(--theme-color);
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum span.nn_bretitle:last-child:hover{
        color: rgb(97, 97, 97);
        cursor: text;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn{
        display: flex;
        align-items: center;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn .nn_socialicons ul{
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn .nn_socialicons ul li{
        display: inline-block;
        cursor: pointer;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn .nn_socialicons ul li .nn_fb{
        color: #fff;
        background-color: #3a5795;
        fill: #fff;
        border-radius: 50px;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn .nn_socialicons ul li .nn_fb:focus,
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialctn .nn_socialicons ul li .nn_wtapp:focus{
        outline: none;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialtitle{
        width: 150px;
        line-height: 15px;
    }
    .nn_productdetails .nn_prodetailsctn .nn_breadcrum .nn_socialtitle span{
        font-size: 13px;
        cursor: text !important;
        font-weight: 500;
        color: rgb(97, 97, 97);
    }
    .bgcolor a {
        text-decoration: none;  
    }
    section.bgcolor{
        background: rgb(245, 238, 238);
        overflow: hidden;
        border: 1px solid #e7edf2;
    }
    section.bgcolor .urgent{
        color: #fff;
        background: linear-gradient(to right, var(--theme-color) 0%, var(--theme-color-hvr) 100%);
        padding: 11px 6px 8px 2px;
        position: absolute;
        right: 10px;
        top: 27px;
        font-size: 14px;
        border-radius: 0px;
        z-index: 1;
        clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 0 100%, 0% 50%, 0 0);
        left: 0px;
        width: 91px;
        /* box-shadow: 8px 0px 47px 50px #000; */
        top: 0px;
        /* font-weight: bolder; */
        border-top-left-radius: 7px;
    }
    .urgent, .urgent1{
        color: var(--subtheme-color);
        position: absolute;
        border-top-left-radius: 7px;
    }
    .urgent{
        background: -webkit-gradient(linear,left top,right top,from(var(--theme-color)),to(var(--theme-color-hvr)));
        background: -webkit-linear-gradient(left,var(--theme-color),var(--theme-color-hvr));
        background: linear-gradient(90deg,var(--theme-color) 0,var(--theme-color-hvr));
        padding: 11px 6px 8px 2px;
        right: 10px;
        top: 27px;
        font-size: 14px;
        border-radius: 0;
        z-index: 9;
        -webkit-clip-path: polygon(100% 0,75% 50%,100% 100%,0 100%,0 50%,0 0);
        clip-path: polygon(100% 0,75% 50%,100% 100%,0 100%,0 50%,0 0);
        left: 0;
        width: 91px;
        top: 0;
    }
    /* chat now and buy now btn */
    .nn_seller_msg,.nn_seller_msg a,.bottom-chat.nonebtn{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .bottom-chat.nonebtn{
        bottom: 0px!important;
    }
    .bottom-chat{
        position: absolute;
        bottom: 0px;
        width: 100%;
        background-color: #fff;
    }
    .nn_seller_msg a img{
        width: 50px;
        height: 50px;
        border-radius: 50px;
    }
    .nn_seller_msg .nn_chatname{
        font-weight: bold;
        font-size: 15px;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 0 0 0 14px;
        background-color: var(--theme-color);
        border-radius: 0 10px 10px 0px;
        color: var(--subtheme-color);
    }
    .nn_prochatbtn1{
        display: flex;
        background: #fff;
        box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.35);
        border-radius: 10px;
        width: auto;
        margin-right: 15px;
    }
    .nn_prochatbtn1 a img{
        padding: 5px;
    }
    .nn_prochatbtn1 a{
        position: relative;
        width: 60px;
    }
    .nn_prochatbtn1 a::after{
        content: "";
        position: absolute;
        right: -24px;
        top: 13px;  
        border-left: 12px solid #fff;
        border-right: 12px solid transparent;
        border-bottom: 12px solid transparent;
        border-top: 12px solid transparent;
    }
    .nn_pro_chatbtn .nn_chatname{
        cursor: pointer;
        display: inline-block;
        text-align: center;
        white-space: nowrap;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        outline: none;
        text-decoration: none;
        background-color: rgb(0, 168, 168);
        padding: 10px 15px;
        border-radius: 0px 10px 10px 0px;
        max-width: 150px;
    }
    .nn_pro_chatbtn .nn_buynowbtn,.nn_pro_chatbtn .nn_soldbtn,.nn_pro_chatbtn .nn_makefeaturedbtn,.nn_pro_chatbtn .nn_sellbtn{   
        cursor: pointer;
        display: inline-block;
        text-align: center;
        white-space: nowrap;
        color: var(--subtheme-color);
        font-size: 16px;
        font-weight: 500;
        outline: none;
        text-decoration: none;
        background: var(--theme-color);
        padding: 10px 15px;
        border-radius: 10px;
        min-width: 150px;
        box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.35);
    }
    .nn_buybtn .nn_buynowbtn{
        color: var(--theme-color);
        font-size: 17px;
        font-weight: bold;
        background: rgb(255 255 255);
        padding: 12px 35px;
        font-weight: 900;
    }
    .nn_prodetails{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 30px 0px;
    }
    .nn_prodetails_title{
        display: flex;
        flex-direction: column;
    }
    .nn_pro_title h1{
        font-size: 22px;
        color: #232323;
        line-height: 22px;
        font-weight: bolder;
        margin: 0px 0px 5px 0px;
        text-transform: capitalize;
    }
    .nn_pro_amt .rtlamtr{
        font-size: 20px;
        font-weight: bold;
        color: #232323;
        width:100%;
    }
    .nn_pro_amt .nn_currency{
        font-size: 20px;
        color:  var(--theme-color);
        font-weight: bold;
    }
    .nn_pro_share ul li{
        display: inline-block;
    }
    .nn_pro_share .nn_bttn span svg{
        font-size: 22px;
        color: #232323;
    }
    .nn_dropdn .dropdown-menu span:active{
        color: #16181b;
        text-decoration: none;
        background-color: #f8f9fa;
    }
    .nn_hours_cal ul li {
        display: block;
    }
    .nn_hours_cal ul li b,.nn_countdowndts b{
        color: #232323;
        font-size: 12px;
        text-transform: uppercase;
        line-height: 20px;
    }
    .nn_hours_cal ul li,.nn_countdowndts .expirydt a,.nn_countdowndts .expirydt span{
        font-size: 12px;
        color: #232323;
        font-weight: 400;
        text-transform: uppercase;
        margin: 0px 0px 5px 0px;
    }
    .expirydt{
        padding-left: 10px;
        color: rgb(0, 168, 168)
    }
    .nn_pro_description {
        margin: 30px 0px;
    }
    .description-product{
        color: rgb(44, 44, 44);
        font-size: 16px;      
        white-space: pre-wrap;
        width: 575px;
        height: 130px;
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 100%;
        text-align: justify;
        margin-bottom: 20px;
    }
    .description-product.buttonissed{
        height: 166px;
    }
    /* .description-product > p {
        white-space: pre-wrap;
        width: 575px;
        height:125px;
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 100%; 
    } */
    .description-product.notcarcatet{
        max-height: initial;
        padding-right: 10px;
        height: auto;
        margin-bottom: 0px;
    }
    .nn_pro_description p{
        font-size: 16px;
        color: #223322;
        font-weight: 400;
        white-space: normal;
    }
    .Toastify__progress-bar.Toastify__progress-bar--animated.Toastify__progress-bar--success{
        background:transparent;
    }
    .Toastify__toast--success{
        opacity: .8!important;
        background: #000!important;
        border-radius:10px;
        font-size:14px;
    }
    .Toastify__close-button{
        display: none;
    }
    .seller-grp-btn{
        z-index: 99;
    }
    .nn_related_pro{
        padding: 0px 15px;
        width: 100%;
        margin: 20px 0px;
    }
    .nn_related_pro h5{
        padding: 0px 10px;
    }
    .nn_related_pro .slick-slide{
        padding: 10px;
    }
    .nn_related_pro .nn_product_list .slick-prev:hover,.nn_related_pro .nn_product_list .slick-prev:focus,.nn_related_pro .nn_product_list .slick-next:hover,
    .nn_related_pro .nn_product_list .slick-next:focus,.nn_related_pro .nn_product_list .slick-next{
        background-color: rgba(33, 33, 33, 0.3) !important;
    }
    .nn_product_list .slick-prev,.nn_product_list .slick-next{
        background-color: rgba(33, 33, 33, 0.3) !important;
    }
    .nn_product_list .slick-prev.slick-disabled,.nn_product_list .slick-next.slick-disabled{
        display: none !important;
    }
    .footer span{
        color:rgb(117, 117, 117);
    }
    .footer{
        padding:10px;
    }
    .product-images{
        padding: 0px;
        background-color: #fff;
        box-shadow: 0 1px 10px 0 rgba(0,0,0,.12);
        border-radius: 8px;
    }
    .product-images img{
        border-radius: 8px 8px 0px 0px;
        height: 250px;
        width:100%;   
        object-fit: cover;
        transition: all .3s;
    }
    .product-images img:hover{
        transform: scale(1.2);
    }
    .product-images h6{
        font-size: 18px;
        color: rgb(44, 44, 44);
    }
    .product-images a{
        text-decoration: none;
    }
    .nn_map_details{
        padding: 0px 25px;
        margin: 70px 0px;
        position: relative;
        width: 100%;
    }
    .nn_map_details .nn_mapsloc{
        margin-top: 30px;
        font-size: 17px;
        color: #949494;
        margin-bottom: 10px;
        font-weight: bold;
    }
    .nn_map_details .nn_mapsloc svg{
        font-size: 27px;
    }
    .nn_map_details .nn_mapsloc span{
        vertical-align: middle;
    }
    .nn_map_details .nn_maps{
        box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.12);
        height: 320px;
        /* border: 1px solid #ddd; */
        border-radius: 5px;
    }
    .nn_map_details .nn_maps img{
        width: 100%;
        height: 100%;        
    }
    .nn_ad_img,.nn_ad_img1 {
        text-align: center;
        box-shadow: 0px 1px 10px 1px rgba(0,0,0,0.12);
    }
    .nn_ad_img1{
        height: 100% !important;
    }
    .nn_ad_img .nn_img{
        width: 100%;
        height: 320px;
    }
    .dropdown-toggle:after{
        display: none;
    }
    .nn_social_icons{
        display: flex;
    }
    .cls_prodright {
        max-height: calc(600px - 100px);
        overflow-y: auto;
        padding-left: 15px;
    }
    .cls_prodright .cls_sticky{
        position: sticky;
        top: 0;
        background-color: #fff;
    }
    .hours-cal{
        color:rgb(44, 40, 41);
        font-size: 14px;
        margin: 10px 0px;
        font-weight: normal;
    }
    .hours-cal i{
        color: black;
        font-size:18px
    }
    .hours-cal{
        width: 100%;
        float: left;
    }
    .nn_pro_chatbtn{
        /* width: 100%; */
        margin-right: 10px;
    }
    .nn_pro_chatbtn .nonevalre{
        width: 25%;
    }
    .nn_pro_chatbtn .seller-grp-btn{
        width: 75%;
    }
    .soldOption {
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        font-weight: 600;
        border: 1px solid var(--theme-color);
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        width: 50px;
        z-index: 1;
        top: 6px;
        text-align: center;
        border-radius: 25px;
        font-size: 14px;
        padding: 2px;
    }
    .nn_productimg a .inner{
        height: 230px;
        width: 100%;
    }
    .nn_productimg a .inner{
        overflow: hidden;
    }
    .nn_productimg a .inner:hover img {  
        -moz-transform: scale(1.2); 
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
    }
    .nn_productimg a .inner img{  
        transition: all .3s;
    }
    .nn_productimg a .inner img{ 
        height: 100%;
        width: 100%;
        border-radius: 8px 8px 0px 0px;
        object-fit: cover;
    }
    .wrapprsear{
        display: none;
    }
    @media screen and (min-width: 768px){
        .nn_productdetails .nn_prodetailsctn .nn_resbreadcrum{
            display: none;
        }
    }
    @media screen and (min-width: 769px){
        .product-left .urgent{
            top: 0px !important;
        }
    }
    @media screen and (min-width: 992px){
        .pos_rel .nn_breadcrum{
            display: none !important;
        }
    }
    @media screen and (min-width: 1024px){
        .nn_product_bg{
            margin: 0px 0px 0px 20px;
        }
        .nn_productdetails .nn_prodetailsctn .nn_procontainer{
            padding-right: 35px !important;
        }
        .bottom-chat.nonebtn{
            bottom: 45px !important;
        }
    }
    @media screen and (min-width: 1200px){
        /* .nn_related_pro .slick-track{
            width: 100% !important;
        } */
        .nn_productdetails .nn_prodetailsctn .nn_procontainer{
            padding-right: 75px !important;
        }
        .bottom-chat{
            bottom: 45px;
        }
    }    
    @media screen and (max-width: 1024px){
        .product-left{
            border-radius: 10px;
            height: auto;
            object-fit: contain;        
        }
        .product-left img{
            height: 450px;
            object-fit: cover;
            border-radius: 0px;
        }
    }
    @media screen and (max-width: 991px){
        .nonevalre{
            display: none;;
        }
        .soldOption{
            top: 65px;
        }
    }
    @media screen and (max-width: 1024px) and (min-width: 991px){
        .bottom-chat.nonebtn{
            bottom: 45px !important;
        }
        .bottom-chat{
            bottom: 50px !important;
        }
        .nn_pro_chatbtn .nn_buynowbtn,.nn_pro_chatbtn .nn_soldbtn,.nn_pro_chatbtn .nn_chatnowbtn, .nn_pro_chatbtn .nn_sellbtn, .nn_pro_chatbtn .nn_makefeaturedbtn{
            min-width: 150px;
        }
    }
    @media screen and (max-width: 991px){
        .nn_chatrtwrapper.active{
            display: none;
        }
        .nn_productdetails .nn_prodetailsctn .nn_breadcrum{
            margin-top: 0px;
            margin-bottom: 25px;
        }
        #nn_procontainer .nn_breadcrum{
            display: none;
        }
        .nn_product_bg{
            margin: 0px;
        }    
        .centeralignteactbuy{
            float:none;
            text-align: center;
        }  
    }
    @media screen and (max-width: 991px) and (min-width: 768px){
        .bottom-chat button.productfeature{
            margin-top:25px;
        }
        .ReactModal__Content.ReactModal__Content--after-open.Modal11{
            background: #fff;
            display: block!important;
            position: fixed!important;
            top:0px!important;
            width:100%;
        }
        .ReactModal__Content.ReactModal__Content--after-open{
            left:0px!important;
            right:0px!important;
            top:0px!important;
            bottom:0px!important;
            border-radius:0px!important;
            margin-right:0px!important;
            transform:none!important;
            max-width: 990px!important;
            width: 100%!important;
            height: 100%!important;
        } 
    }
    @media screen and (max-width: 991px){
        .wrapprsear{
            left: 5px;
            position: absolute;            
            top: 9px;            
            display: block!important;
        }
        .nn_backarrow button{
            background-color: transparent !important;
        }     
    }
    @media screen and (max-width: 767px){
        .nn_breadcrum{
            padding-top: 20px;
        }
        #nn_procontainer .nn_breadcrum{
            display: none;
        }
        .nn_productdetails .nn_prodetailsctn{
            padding: 0px 30px;
        }
        .nn_prodetails{
            padding-top: 0px;
        }
        .nn_related_pro .nn_product_list .slick-dots{
            display: none !important;
        }
        .nn_product_bg {
            background-color: #f2f2f2;
            padding: 0px;
            margin: 0 0px;
        }
        .nn_map_details .nn_maps{
            margin: 20px 0px 40px;
            height: 200px;
        }       
        .cls_prodright{
            padding-left: 0px;
            max-height: initial;
            overflow-y: auto;
        }
        .bottom-chat{
            padding-left: 0px;
        }
        .bottom-chat.nonebtn,.nn_seller_msg{
            flex-wrap: wrap;
        }
        .bottom-chat{
            position: relative;
            width:100%;
            float: left;
        }
        .nn_pro_chatbtn .nn_chatnowbtn,
        .nn_pro_chatbtn .nn_buynowbtn{
            min-width: 210px;        
            margin: 5px 0px;
        }
        .nn_pro_chatbtn{
            margin-right: 0px;
        }
        .nn_pro_chatbtn .nn_soldbtn,.nn_pro_chatbtn .nn_makefeaturedbtn,.nn_pro_chatbtn .nn_sellbtn{
            margin: 0px 5px;
        }
        .ReactModal__Content.ReactModal__Content--after-open.Modal11{
            background: #fff;
            display: block!important;        
        }
        .ReactModal__Content.ReactModal__Content--after-open{
            left:0px!important;
            right:0px!important;
            top:0px!important;
            bottom:0px!important;
            border-radius:0px!important;
            margin-right:0px!important;
            transform:none!important;
            width:100%!important;
            height:100%!important;
        }    
        .nn_productdetails{
            padding-bottom: 0px;
            padding-top: 30px;
        }   
        .nn_productdetails .nn_prodetailsctn{
            padding: 0px;
        }
        .nn_prodetailsctn .nn_gdcontainer{
            width: 100%;
            margin: 0px;
        }
        .nn_productdetails .nn_prodetailsctn .nn_resbreadcrum{
            display: flex;
            flex-direction: column;
            background: #f2f2f2;
            padding: 5px 15px;
            border-radius: 10px;
        }
        .nn_socialctn{
            display: flex;
            align-items: center;
        }
        .nn_socialicons ul li{
            display: inline-block;
        }
        .nn_socialicons ul li .nn_fb{
            color: #fff;
            background-color: #3a5795;
            fill: #fff;
            border-radius: 50px;
        }
        .nn_socialtitle{
            font-size: 14px;
            color: rgb(117, 117, 117);
        }
        .nn_prodetails{
            padding-top: 20px;
        }      
        .nn_pro_share.float-right {           
            width: 100%;
            margin: 0 auto;
        }
        .nn_map_details{
            padding: 0px 15px;
            margin: 20px 0px;
        }
        .nn_related_pro{
            padding: 0px 10px;
        }
        .nn_dropdn button{
            padding: 0px 3px;
        }
        .nn_prochatbtn1{
            margin: 5px 0px;        
        }
        .nn_pro_chatbtn .nn_soldbtn,.nn_pro_chatbtn .nn_makefeaturedbtn,.nn_pro_chatbtn .nn_sellbtn{
            min-width: unset;        
            margin: 10px 5px;
        }
        .nn_pro_title h1{
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .nn_map_details .nn_maps img{
            object-fit: cover;
        }
        .nn_ad_img .nn_img{
            width: 100%;
            height: 100%;
        } 
        .reposnreportview {
            display: inline-block;
            position: absolute;
            right: -10px;
            z-index: 9;
        }
        .reposnreportview .dropdown-menu.show{
            transform:translate3d(-25px, 33px, 0px)!important;
        }        
        .wrapprsear.nn_arabic{
            text-align: right;
            left: unset;
            right: 5px;
        }        
        .product-left{
            border-radius: 10px;
            height: auto;
            object-fit: contain;        
        }
        .product-left img{
            height: 100%;
            object-fit: cover;
            border-radius: 0px;
        }
        
        .nn_product_bg.product-left .slick-next{            
            right: -10px;                        
        }
        .nn_product_bg.product-left .slick-prev{            
            left: -10px;            
        }
        .nn_productdetails .nn_prodetailsctn .nn_resbreadcrum{
            background: #f2f2f2;
            padding: 5px 15px;
            border-radius: 10px;
        }  
        .App-testimonial-count{
            bottom:7px!important; 
            left: 0px!important; 
            top:auto!important;
        }
        .bottsnn{
            margin-top: 35px;
        }
    }
`;

// Loader

export const Loader = styled.div`
    position: relative;
    .stage{
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        overflow: hidden;
    }
    .stage1{
        position: absolute;
        left: 50%;
        bottom: 50%;
        transform: translate(-50%,-50%);
        height: 100%;
    }
    .dot-bricks {
        position: relative;
        top: 8px;
        left: -9999px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #000;
        color: #000;
        box-shadow: 9991px -16px 0 0 #000, 9991px 0 0 0 #000, 10007px 0 0 0 #000;
        animation: dotBricks 2s infinite ease;
    }
  
    @keyframes dotBricks {
        0% {
        box-shadow: 9991px -16px 0 0 #000, 9991px 0 0 0 #000, 10007px 0 0 0 #000;
        }
        8.333% {
        box-shadow: 10007px -16px 0 0 #000, 9991px 0 0 0 #000, 10007px 0 0 0 #000;
        }
        16.667% {
        box-shadow: 10007px -16px 0 0 #000, 9991px -16px 0 0 #000, 10007px 0 0 0 #000;
        }
        25% {
        box-shadow: 10007px -16px 0 0 #000, 9991px -16px 0 0 #000, 9991px 0 0 0 #000;
        }
        33.333% {
        box-shadow: 10007px 0 0 0 #000, 9991px -16px 0 0 #000, 9991px 0 0 0 #000;
        }
        41.667% {
        box-shadow: 10007px 0 0 0 #000, 10007px -16px 0 0 #000, 9991px 0 0 0 #000;
        }
        50% {
        box-shadow: 10007px 0 0 0 #000, 10007px -16px 0 0 #000, 9991px -16px 0 0 #000;
        }
        58.333% {
        box-shadow: 9991px 0 0 0 #000, 10007px -16px 0 0 #000, 9991px -16px 0 0 #000;
        }
        66.666% {
        box-shadow: 9991px 0 0 0 #000, 10007px 0 0 0 #000, 9991px -16px 0 0 #000;
        }
        75% {
        box-shadow: 9991px 0 0 0 #000, 10007px 0 0 0 #000, 10007px -16px 0 0 #000;
        }
        83.333% {
        box-shadow: 9991px -16px 0 0 #000, 10007px 0 0 0 #000, 10007px -16px 0 0 #000;
        }
        91.667% {
        box-shadow: 9991px -16px 0 0 #000, 9991px 0 0 0 #000, 10007px -16px 0 0 #000;
        }
        100% {
        box-shadow: 9991px -16px 0 0 #000, 9991px 0 0 0 #000, 10007px 0 0 0 #000;
        }
    }
`;

// FilterModal in header responsive

export const FilterModal = styled(Modal)`
    background: #fff;
    display: block!important;
    left:0px!important;
    right:0px!important;
    top:0px!important;
    bottom:0px!important;
    border-radius:0px!important;
    margin-right:0px!important;
    transform:none!important;
    max-width: 990px!important;
    width: 100%!important;
    height: 100%!important;
    .popfilltegh{
        position: relative;
    }
    .border-btm{
        border-bottom:1px solid #eee;
        padding: 8px;
    }
    .overallpaddpp{
        padding: 15px;
    }
    .jsvhtV{
        display: inline-block;
        padding-left: calc(6px);
        padding-right: calc(6px);
        align-self: auto;
        flex: 0 0 auto;
        vertical-align: bottom;
    }
    .jsvhtV.selledetaa,.nn_categoryHide{          
        display: none;
    }
    .jsvhtV.selledetaa{
        display: block!important;
    } 
    .jsvhtV.selledetaa{
        float: left;
        padding:0px!important;
    }
    .fXFqhW {
        display: inline-block;
        padding-left: calc(6px);
        padding-right: calc(6px);
        align-self: auto;
        flex: 1 1;
    }
    .fznnpf{
        fill: currentcolor;
        user-select: none;
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        transition: fill 0.25s ease 0s;
    }
    .fznnpf:focus{
        outline:none!important;
    }
    .jxllvb {
        font-size: 1em;
        width: 40px;
        height: 40px;
        color: rgb(189, 189, 189);
        background: transparent;
        border:none;
    }
    .iVJeIQ{
        font-size: 18px;
        color: rgb(44, 44, 44);
    }
    .fcxopb {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        margin-bottom: 4px;
        width: 100%;
    }
    .fcxopb > h1 {
        font-size: 18px;
    }
    select{
        -webkit-appearance: none;
        border: none;
        height: 60px;
    }
    select:focus{       
        outline: none;
        box-shadow: none;
    }
    .arrow{
        border: solid black;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        position: absolute;
        right: 1em;
        top: 1.5em;
    }
    .nn_homefilter .nn_fliterctn .nn_fltproctn{
        display: block;
        font-size: 16px;
        text-transform: capitalize;
        color: #000;
        font-weight: 600;
        padding-bottom: 5px;
    }
    .nn_homefilter .nn_fliterctn{
        padding: 10px 15px;
        position: relative;
        /* border-bottom: 2px solid #eeeeee; */
    }
    .nn_homefilter .nn_fliterctn .nn_fltproctn{
        display: block;
        font-size: 16px;
        text-transform: capitalize;
        color: #000;
        font-weight: 600;
        padding-bottom: 5px;
    }
    .nn_fliterctn .nn_adlabel{
        margin-left: 0px;
    }
    .nn_fliterctn .nn_adlabel span:last-child{
        font-size: 15px;
        font-weight: 400;
    }
    .nn_adlabel{
        display: flex !important;
    }
    .cls_licount {
        display: flex;
        white-space: nowrap;
        width: 100%;
        -webkit-box-align: center;
        align-items: center;
        scroll-behavior: smooth;
        overflow-x: auto;
        &.nn_licount{
            /* justify-content: center; */
        }
        &.nn_licount1{
            justify-content: start;
        }
    }
    .nn_categorylistname {
        position: relative;
    }
    .nn_categorylist {
        display: flex;
        background: var(--theme-color);
        padding: 0px;
    }
    .nn_catealign {
        padding: 15px 12px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        white-space: nowrap;
    }
    .nn_categoryctn {
        height: 50px;
        width: 50px;
        display: inline-block;
        position: relative;
    }
    .cls_licount::-webkit-scrollbar {
        -webkit-appearance: none !important;
        display: none !important;
    }
    .cls_licount::-moz-scrollbars {
        display: none !important;
    }
    .cls_licount .opLow {
        opacity: .35 !important;
    }
    .nn_categorylist.hidden .cls_licount{
        padding: 0px 10px 0 25px;
        /* justify-content: center; */
    }   
    .nn_categorylist.active .cls_licount{
        justify-content: start;      
        padding: 0px 30px;
    }
   
    .nn_categorylist.active .nn_btn.hidden{
        display: flex;
    }
    .nn_btn.hidden {
        display: none;
    }
    .nn_btn.cls_left.hidden,.overallpaddpp .cls_cate_mbl{
        display: none;
    }
    .nn_categorylist.active .cls_licount{
        justify-content: start;
    }
    .nn_categoryctn a{
        color: #fff;
    }
    .nn_categoryctn a .cateimg{
        width: 100%;
        height: 100%;
        object-fit: contain;
        background: #fff;
        border-radius: 50px;
        border: 1px solid #000;
    }
    .nn_categoryctn .closecate{
        position: absolute;
        top: -10px;
        right: -7px;
    }
    .nn_catetitle{
        color: var(--subtheme-color) !important;
        text-decoration: none; 
        font-size: 17px;
        font-weight: 600;
        margin-left: 10px;
    }
    .nn_btn .nn_catebtn{
        background: transparent;
        border: none;
        color: var(--subtheme-color);
    }
    .nn_btn .nn_catebtn:focus{
        outline: none;
    }
    .nn_btn .nn_catebtn .icon{
        font-size: 50px;
    }  
    @media screen and (max-width: 991px){             
        .overallpaddpp .nn_categorylist{
            display: flex;
            padding: 0px 45px 0px 25px;
            border-radius: 20px 0px;
            box-shadow: 0px 2px 9px 1px rgba(0,0,0,0.32);
        }                      
        .overallpaddpp {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
            height: 100%;
        }   
        .cls_licount.nn_licount1 .nn_selectCate.nn_catealign{
            position: absolute;
            left: 50%;
            z-index: 99;
            background: var(--theme-color);
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            width: 100%;
        }
        .cls_licount.nn_licount .nn_selectCate.nn_catealign{
            position: unset;
            left: unset;
            background: transparent;
            transform: unset;
        }                               
    }      
    @media screen and (min-width: 768px) and (max-width: 991px){
        .overallpaddpp .cls_cate_mbl{
            display: none;
        } 
        .overallpaddpp .nn_adfilter{
            margin: 15px 0px;
            box-shadow: none;
            background: #fff;
            border: 0px solid #fff;
            position: relative;
        }  
        .overallpaddpp .nn_categorylist.hidden .cls_licount{
            padding: 0px 10px 0px 25px;
        }
        .overallpaddpp .cls_licount.nn_licount1{
            justify-content: start;
        }
        .nn_btn{
            background: var(--theme-color);
            position: absolute;
            padding: 14px 0px;
        }
        .nn_btn.cls_left {
            border-radius: 20px 0px 0px;
            left: 0px;
        }
        .nn_btn.cls_left.hidden {
            display: none;
        }
        .nn_btn.cls_right {
            right: 0px;
            border-radius: 0px 0px 20px 0px;
        }       
    }
    @media screen and (max-width: 768px){               
        .nn_btn{
            padding: 12px 0px;
        }
        .nn_catealign{
            padding: 10px 20px;
        }
        .nn_btn .nn_catebtn .icon{
            font-size: 42px;
        }
        .nn_categorylist.hidden .cls_licount.active{
            padding: 0px 10px;
        }
        /* .nn_categorylist.hidden .nn_btn.hidden{
            display: flex;
        } */
    }
    @media screen and (max-width: 767px){
        .popfilltegh {
            height: 100%;
            padding-bottom: 30px;
        }
        .nn_categorylist{
            display: flex;
            padding: 0px 45px;
            border-radius: 20px 0px;
            box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.32);
            position: relative;
        }  
        .overallpaddpp .nn_adfilter{
            max-height: initial;
        }  
        .overallpaddpp .nn_categorylist{           
            padding: 0px;
            border-radius: 0px;
            box-shadow: 0px 2px 9px 1px rgba(0,0,0,0.32);
        }     
        .overallpaddpp .cls_licount,.overallpaddpp .nn_btn.cls_left,.overallpaddpp .nn_btn.cls_right{
            display: none;
        }
        .overallpaddpp .cls_cate_mbl{
            display: block;
            width: 100%;            
            background: #ffffff;
            position: relative;
            &:focus{
                box-shadow: 0px 1px 0px 1px rgba(0,0,0,0.1);
            }
        }    
        .overallpaddpp .cls_cate_mbl select{
            height: 60px;
            color: rgb(0, 0, 0);
            font-weight: bold;
            display: block;
            width: 100%;
        }           
    }
`;

// EditProfileModal

export const EditProfileModal = styled(Modal)`
    max-width: 800px !important;
    margin: 0 auto;
    bottom: auto !important;
    border: none !important;
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    .rm-space {
        margin: -20px;
    }
    .nn_modal_header1{
        padding: 1rem 1rem;
        border-bottom: 1px solid #dee2e6;
        border-top-left-radius: .3rem;
        border-top-right-radius: .3rem;
    }
    #editprofile #tabs .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active{
        color: var(--theme-color);
        background-color: initial;
        border-color: transparent transparent var(--theme-color);
        border-bottom: 2px solid!important;
        font-size: 16px;
    }
    .nn_share_ctn{
        text-align: right;
    }
    .nn_close_btn .nn_close_icon{
        color: var(--theme-color);
    }         
    .iDhWYa{
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        font-family: var(--theme-fontfamily);
        width: 100%;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-color);
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: white;
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        border-color: var(--theme-color);
        border-width: 1px;
        border-style: solid;
    }
    .iDhWYa:hover{
        color: var(--theme-color);
        background-color: rgb(255, 216, 220);
    }           
    .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover{
        border-color: transparent transparent #ddd;
        border-bottom: 1px solid #ddd;
    }
    .jqNCys .avatar {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        align-content: center;
        vertical-align: middle;
        user-select: none;
        font-size: 20px;
        color: rgb(255, 255, 255);
        background-color: rgb(224, 224, 224);
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
    }
    .kVtcKR {
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        flex-direction: column;
        padding-left: 8px;
    }
    .kVtcKR span {
        color: rgb(117, 117, 117);
        font-weight: bold;
        font-size: 14px;
    }
    .kVtcKR span:last-child {
        font-weight: normal;
    }
    .setting,.settings,.curpnt{
        cursor: pointer;
    }
    .nav-item.nav-link{
        color: #333;
    }
    .tab-content.overall-mg{
        margin:20px;
    }
    .imageUpload{
        width: 100%;
        cursor: pointer;
        display: flex;
        padding: 10px;
        border: 2px dashed rgb(170, 170, 170);     
        border-radius: 5px;
        position:relative;
        margin-bottom:15px;
    }
    .imageUpload input[type=file]{
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100px;
        cursor:pointer;
    }
    .nn_fullname,.nn_password{
        width: 100%;
    }
    .nn_fullname div:first-child div::after,.nn_password div:first-child div::after{
        border-color: var(--theme-color);
    }
    .sav_chang .btn-danger{
        background: var(--theme-color)!important;
        border-radius:32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    .log_out{
        text-align: center;
        margin-top: 10px;
        color:var(--theme-color);
        font-weight:bold;
    }
    @media (min-width: 1200px)  {
        body.ReactModal__Body--open{
            overflow-y: hidden!important;
        }         
        .nn_edit_profileicon{       
            right: 37%;
        }
    }
    @media screen and (max-width:1023px) and (min-width: 768px){
        .nn_edit_profileicon{       
            right: 44%;
        }
        .nn_edit_allproducts .nn_edit_proctn{
            width: 100%;
        }
    }    
    @media screen and (max-width:767px){
        .nn_wrapperedit{
            padding: 0px 10px;
            width: 100%;
        }
        .nn_edit_profile{
            padding: 15px 0px;
        }
        .nn_tab_ctn{
            margin-left: 0px;
            margin-top: 15px;
        }   
        .nn_order_details{
            padding:10px 5px;
        }
        .nn_order_details table tr td, .nn_order_details table tr th{
            padding: 0px 5px;
            width: 25%;
        }
        .leftimgrev,.leftimgrev.seller{
            width: 60%!important;
            margin-left: 2%!important;
        }         
        .wholereviewwr{
            width: 25%!important;
        }
        .wholereviewwr img{
            width:85px!important;
            height:85px!important;
        } 
        .Toastify__toast-container--bottom-center{
            margin-left:0px!important;
            left:0px!important;
        }
        .Toastify__toast-container{
            width: 100vw!important;
        }
        .rightPart.selledreight{
            position: absolute;
            width:100%;
            padding-right:0px!important;
        }
        .nn_edit_allproducts .nn_edit_proctn{
            width: 100%;
        }      
        .nn_edit_orderproctn .nn_edit_prosection,.nn_edit_orderproctn .bgcolor{
            text-align: center;
        }        
    }  
    @media (min-width: 320px) and (max-width: 380px) {
        .wholereviewwr{
            width: 25%!important;
        }
        .wholereviewwr img{
            width:50px!important;
            height:50px!important;
        }       
    }
`;

// SellYourStuff

export const SellYourStuff = styled.div`
    .nn_sell_title{
        margin: 25px 0px !important;
    }
    .nn_noteclr{
        color: red;
        font-size: 16px;
        font-weight: 500;
    }
    .whpls{
        width:100%;
    }
    .nn_cate_select select{
        width: 100%;
        box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.32);
        margin-top: 20px;
        -webkit-appearance: none;
        color: #000;
    }
    .nn_cate_select select:focus{
        outline: none;
    }
    .nn_cate_select select option:first-child{
        background-color: rgba(0, 0, 0, 0.08);
        color: #000 !important;
    }
    .nn_dropdownsell div[class*= " MuiFormControl-fullWidth-"]:first-child{
        margin: 0px;
    }
    .nn_dropdownsell{
        position: relative;
    }   
    .nn_cate_select select option{
        padding: 5px;
    }
    .nn_cate_select::before{
        content: "";
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 6px dashed;
        border-right: 6px solid transparent;
        border-left: 6px solid transparent;
        position: absolute;
        top: 35px;
        right: 20px;
        z-index: 9;
    }
    .languagechange{
        display: block !important;
        box-shadow: 0 2px 2px 0 rgba(0, 188, 212, 0.14), 0 3px 1px -2px rgba(0, 188, 212, 0.2), 0 1px 5px 0 rgba(0, 188, 212, 0.12);
        background-color: var(--theme-color) !important;
        color: var(--subtheme-color) !important;
    }   
    .languagechange span{
        position: relative;
        z-index: 9;
    }
    .sell-stuff label{
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
        display: inline-flex;
        font-size: 14px;
        line-height: 1.428571429;
        font-weight: 400;
    }
    .nn_dropdownsell .nn_seller_dropdn,.nn_dropdownsell .cls_selectafter,.cls_inrange.nn_seller_input{
        margin-bottom: 15px;
    }
    .sell-stuff .overflowiss{
        padding: 25px;
    }
    .sell-stuff .textArea{
        width: 100%;
    }
    .nn_sell_input{
        margin-bottom: 0px;
    }
    .nn_sell_proimg{
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
    }
    .nn_stuffimg{
        background-color: #f2f2f2;
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
    }
    .nn_map_cardbody,.nn_map_img{
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25) !important;
    }
    .cls_h6 {
        text-transform: capitalize !important;
        margin: 25px 0 10px !important;
        color: #000 !important;
        line-height: 1.2em !important;
        font-weight: 700 !important;
        font-size: 16px !important;
    }
    .paymentwrapper{
        width:100%;
        float: left;
        text-align:center;
        margin-top: 50px;
        /* height: 700px!important;
        overflow-y: scroll!important; */
    }
    .paymentactive {
        background-color: var(--theme-color)!important;
        color: var(--subtheme-color)!important;
    }
    .paymenttitle{
        width:90%;
        /* float: left; */
        margin:0 auto;
        text-align:center;
    }
    .paymenttitle h5{
        font-size: 18px; 
    }
    .paymenttitle img{
        width: 25px;
        padding-right: 10px; 
    }
    .paymenttitle.titlebgspsce{
        margin-bottom:20px;
    }
    .payloadingcss{
        position: relative;
    }
    .fixedpayment {
        text-align: center;
        vertical-align: middle;
        position: fixed;
        left: 40%;
        top: 40%;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }   
    .nobtnvw{
        display: none;
    }
    .centeralignteactbuy{
        width:100%;
        float: left;
        padding: 15px 35px;
        /* text-align: center;    */
    }
    .tabcontebt {
        width: 100%;
        float: left;
    }
    .jss799.btncolorchange{
        background: var(--theme-color);
        color: #fff!important;
    }
    .btncolorchange{
        border-bottom: none!important;
        margin-right: 15px!important;
        border-radius: 32px!important;
        padding: 5px!important;
        color: var(--theme-color);
        font-weight: bold!important;
        border-top: 1px solid var(--theme-color)!important;
        border-left: 1px solid var(--theme-color)!important;
        border-right: 1px solid var(--theme-color)!important;
        border-bottom: 1px solid var(--theme-color)!important;
        margin-bottom:10px;
        text-align: center;
    }
    .reactbuy {
        width:100%;        
        padding: 15px 35px;
        text-align: center;
    }
    .reactbuy ul li{
        display: inline-block;
        width:25%;
        cursor: pointer;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .reactbuy.centeralignteactbuy ul {
        padding: 0px;
        text-align: center;
    }
    .paymentactive {
        background-color: var(--theme-color)!important;
        color: var(--subtheme-color)!important;
    }
    .sav_chang.paymentbtnres {
        width: 100%;
        margin-bottom: 15px;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    .tabcontebt p{
        color: rgb(117, 117, 117);
        font-size: 14px;
        font-weight: normal;
    }
    .tabcontebt h5{
        margin-bottom:20px;
    }
    .tabimgvw{
        width:100%;
        float: left;
    }
    .centealgnimg{
        width:100%;
        float: left;
        padding:25px;  
    }
    .centealgnimg img{
        width:100%;
        height: 250px;
        object-fit: contain;
    }
    .cls_paymodal .fKYHrH{
        position: initial !important;
    }
    .cls_paymodal .fixedpayment{
        position: relative;
        left: 0;
        top: 45%;
    }
    .cls_paymodal .modal-header .close{
        padding: 1rem 1rem;
        margin: -1rem -1rem -1rem auto;
    }
    .stripedf{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .cls_stripe{
        text-align: left;
        margin: 0;
    }
    .cls_stripe label{
        margin-bottom: 20px;
    }
    .cls_stripe button {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        margin-top: 20px;
        padding: 7px 32px;
    }
    .StripeElement {
        box-sizing: border-box;
        height: 40px;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }
    .StripeElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }
    .StripeElement--invalid {
        border-color: #fa755a;
    }
    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
    .PaypalExpressBtn{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .upload-btn-wrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
    }
    .upload-btn-wrapper .btn {
        color: #fff;
        box-shadow: 0 2px 2px 0 rgba(233, 30, 99, 0.14), 0 3px 1px -2px rgba(233, 30, 99, 0.2), 0 1px 5px 0 rgba(233, 30, 99, 0.12);
        background-color: var(--subtheme-color);
        padding: 8px 20px;
    }  
    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
    .previewfilenameup{
        display: inline-block;
        vertical-align: top;
        margin-left: 20px;
        margin-top:10px;
    }
    .fKYHrH > h1 {
        font-size: 40px;
        text-align: center;
    }
    .fKYHrH{
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .fx_img img {
        width: 88px;
        height: 88px;
    }
    .img_cvr {
        position: relative;
        display: inline-block;
    }
    .img_cvr > button {
        position: absolute;
        right: 4px;
        bottom: 4px;
        background-color: rgba(33, 33, 33, 0.9);
        border: none;
        color: #FFF;
        border-radius: 24px;
        padding: 4px 9px;
        margin: 0px 2px 2px 0px;
    }
    .img_cvr > button > svg {
        height: 15px;
        color: #fff;
        fill: #fff;
    }
    .addImage {
        width: 88px;
        height: 88px;
        border: 1px solid rgb(224, 224, 224);
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        color: #fe3f55;
        display: flex;
    }
    .mgrhd{
        margin:15px;
    }
    .jjQxhd{
        color: rgb(117, 117, 117);
        line-height: 1.2em;
        font-weight: 500;
        font-size: 16px;
        margin-bottom:15px;
        text-align: left;
    }
    .jjQxhd {
        color: rgb(117, 117, 117);
        line-height: 1.2em;
        font-weight: 500;
        font-size: 16px;    
    }
    .jjQxhd.editct{
        color: rgb(189, 189, 189);
        line-height: 1.2em;
        font-weight: 500;
        font-size: 16px;
    }
    .hEdZD {
        color: rgb(189, 189, 189);
        line-height: 1.2em;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        margin: 5px 0px;
    }
    .bwlsAW {
        box-sizing: border-box;
        display: flex;
        width: 130px;
        margin:0 auto;
    }
    .dividerOr {
        width: 100%;
        display: flex;
        align-content: center;
        -webkit-box-align: center;
        align-items: center;
        color: rgb(224, 224, 224);
    }
    .dividerOr::before, .dividerOr::after {
        content: "";
        display: block;
        height: 1px;
        width: 50%;
        background: rgb(224, 224, 224);
        margin: 0px 10px;
    }

    .bcSoLl {  
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;   
        text-overflow: ellipsis;
        font-family: var(--theme-fontfamily);
        color:  var(--subtheme-color);
        width: auto;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: var(--theme-color);
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
    }
    .bcSoLl > span {
        display: inline;
        vertical-align: middle;
        line-height: 1.5em;
    }
    .postingg{
        text-align: center;
        margin-top:25px;
    }
    .peolpnear p{
        font-size:16px;   
    }
    .peolpnear.nopacke{
        display: block!important;
    }
    .peolpnear{
        display: none
    }
    .cgKAdd{
        box-sizing: border-box;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        text-align:center
    }

    .gcWmdh {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        margin: 0px 15px;
    }
    .gcWmdh img{
        width: 85px;
        height: auto;
    }
    .hHaDQu{
        color: rgb(44, 44, 44);
        line-height: 1.2em;
        font-weight: 800;
        font-size: 16px;
        margin: 0px; 
    }
    .tss{
        display: flex;
        margin-top:20px;
        justify-content: center;
    }
    .svficon{
        display: inline-block;
    }
    .bvCUu p{
        display: inline-block;
    }
    .bvCUu.mgdf{
        margin-top:10px; margin-bottom:10px;
    }
    .middle {
        display: table-cell;
        vertical-align: middle;
    }
    .innercongrat {
        margin-left: auto;
        margin-right: auto;
        width: 400px;    
    }
    .innercongrat h1{
        text-align: center;
        margin-top:20px;
    }
    .paywish .innercongrat{
        width:525px!important;
    }
    .paymentactive{
        background-color: var(--theme-color)!important;
        color: var(--subtheme-color)!important;
    }    
    .innercongrat .paymentwrapper{
        margin-top: 25px;
    }
    .innercongrat .paymenttitle.titlebgspsce{
        margin-bottom:15px;
    }
    .fottebtnd{
        margin-top: 25px;
        box-shadow: rgba(0, 0, 0, 0.12) 0px -1px 3px 0px;
        position: sticky;
        bottom: 0px;
        width: auto;
        background-color: rgb(255, 255, 255);
        z-index: 999;
        margin-left: -25px;
        margin-right: -25px;
        padding: 14px;
    }
    .textArea >::after,.nn_seller_input div >::after {
        border-color: var(--theme-color) !important;
    }
    .nn_dropdownsell div[class*= " MuiFormControl-fullWidth-"]{
        margin: 0px 0px 20px;
    }
    .nn_sell_addlangbtn{
        background-color: var(--theme-color);
        box-shadow: 0 2px 2px 0  var(--theme-color-hvr), 0 3px 1px -2px var(--theme-color-hvr), 0 1px 5px 0 var(--theme-color-hvr);
    }
    .nn_sell_addlangbtn:hover,.nn_sell_addlangbtn:focus{
        background-color: var(--theme-color);
        box-shadow:0 14px 26px -12px var(--theme-color-hvr), 0 4px 23px 0px var(--theme-color-hvr), 0 8px 10px -5px var(--theme-color-hvr);
    }
    span.nn_checked + .nn_checkbox{
        background-color: var(--theme-color-hvr) !important;
    }
    span.nn_checked{
        color: var(--theme-color) !important;
    }
    .nn_switchicon{
        border: 1px solid rgba(0, 0, 0, .1);
    }    
    .validatcolor {        
        color: #f54a61;
    }
    .filepicker.dropzone.dz-clickable.dz-started .dropZoneDefault{
        display: none;
    }
    .filepicker.dropzone.dz-clickable.dz-started .dz-default.dz-message{
        display:none;
    }    
    .filepicker.dropzone.dz-clickable.dz-started{
        width: 100%;
        padding: 5px;
    }
    .filepicker.dropzone.dz-clickable img{
        width: auto;
        object-fit:contain;
        height: 375px;
    }
    .filepicker .dz-preview ~ .dz-preview{
        width: auto !important;
        margin: 0px 20px 10px 0px;
    }
    .filepicker .dz-preview ~ .dz-preview img{
        width: 88px !important;
        height: 88px !important;
    }
    .dz-preview.dz-clickable.dz-image-preview{
        width: 100%;
        display: inline-block;
        padding: 5px;
        margin-bottom: 10px;
    }
    .dz-details img{
        border-radius: 8px;
    }
    .filepicker.dropzone.dz-clickable.dz-started,.filepicker.dropzone.dz-clickable{
        text-align: center;
    }
    .filepicker.dropzone.dz-clickable.dz-started.nn_img{
        position: relative;
        text-align: center;
    }
    .filepicker.dropzone.dz-clickable.dz-started.nn_img:last-child::after{
        content: "+";
        border: 1px solid rgb(245, 245, 245);
        height: 90px;
        width: 90px;
        position: absolute;
        border-radius: 8px;
        text-align: center;
        line-height: 90px;
        font-size:40px;
        margin-top:5px;
        margin-left: -45px;
        color:var(--theme-color);
        box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.25);
        /* display: block;
        margin: 0 auto; */
    }
    /* .nn_edit_product .dz-preview.dz-clickable.dz-complete.dz-image-preview{
        display: block !important;
    } */
    .filepicker.dropzone.dz-clickable.dz-started div:nth-child(2){
        display: block;
    }
    .nn_edit_product .dz-preview.dz-clickable.dz-image-preview,
    .nn_create_product .dz-preview.dz-clickable.dz-image-preview{
        display: block !important;
    }
    .nn_edit_product .filepicker .dz-preview ~ .dz-preview,
    .nn_create_product .filepicker .dz-preview ~ .dz-preview{
        display: inline-block !important;
    }
    .filepicker.dropzone.nn_img.dz-clickable{
        text-align: center;
    }
    .dz-clickable  {
        cursor: pointer;
    }
    .nn_edit_product .filepicker .dz-preview ~ .dz-preview,
    .nn_create_product .filepicker .dz-preview ~ .dz-preview{
        margin: 0px 55px 10px -45px;
    }
    .nn_create_product {
        .addimg{
            pointer-events: unset;
        }
        .addimg1{
            pointer-events: none;
        }
        .dz-details{
            button{
                pointer-events: visible;
            }
        }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
    .nn_seller_input div:first-child{
        padding: 0px !important;
        margin: 0px 0px 5px;
    }
    /* .nn_seller_dropdn{
        margin: 0px 0px 30px;
    }
    .nn_seller_dropdn1{
        margin: 0px;
    } */
    .nn_seller_dropdn::after , .nn_seller_dropdn1::after , .cls_selectafter::after {
        border-color: var(--theme-color) !important;
    }
    /* .cls_selectafter svg[class*= "MuiSelect-icon-"]{
        right: 0;       
    } */
    .nn_sell_addlangbtn{
        margin: 0px 0px 15px !important;
    }
    .botnbtn{
        text-align:center;
    }
    .ReactModal__Content.ReactModal__Content--after-open{
        position: fixed;
        right: 0px;
        top: 0px!important;
        max-width: 500px;
    }
    .dquJfs.ezTDQq.addimg.nn_sell_proimg{
        pointer-events: unset;
    }
    .dquJfs.ezTDQq.nn_sell_proimg{
        pointer-events: none;
    }
    .dquJfs.ezTDQq.nn_sell_proimg{
        .nn_stuffimg{
            pointer-events: visible;
        }
    }
    .dquJfs.ezTDQq.addimg .filepicker.dropzone.dz-clickable.dz-started.nn_stuff_img:last-child::after,    
    .nn_etprofile .dquJfs.ezTDQq.addimg .filepicker.dropzone.dz-clickable.dz-started.nn_stuff_img:last-child::after,
    .nn_etprofile .dquJfs.ezTDQq.addimg .filepicker.dropzone.dz-clickable.nn_stuff_img:last-child::after
   {
        content: "+";
        /* border: 1px solid rgb(245, 245, 245); */
        border-radius: 8px;
        text-align: center;
        line-height: 90px;
        font-size: 40px;
        margin: 0px 15px 0px 5px;
        color: var(--theme-color);
        padding: 20px 35px;
        vertical-align: middle;
        box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.25);
    }
    .dquJfs {
        border-width: 2px;
        border-style: solid;
        border-color: rgb(245, 245, 245);
        border-image: initial;
        border-radius: 12px;
        margin-top:20px;
        padding: 5px 0px;
    }
    .dquJfs:hover{
        border: 2px solid rgb(189, 189, 189);
    }
    .ezTDQq {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        flex: 1 1 0%;
        min-height: 300px;  
    }

    .dquJfs .dropZoneDefault {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        text-align: center;
        flex: 1 1 0%;   
    }
    .bzPLnz{  
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        margin-bottom: 4px;
        width: 100%;
        -webkit-box-pack: center;
        justify-content: center;
    }
    .bzPLnz > h1 {
        font-size: 20px;
        font-weight: 700;
        text-align: center;
    }
    .egCyIy{
        color: rgb(117, 117, 117);
        line-height: 20px;
        font-weight: 500;
        font-size: 14px;
        margin: 0px 70px;
    }
    .categoryname{
        text-transform: uppercase;
        font-size: 11px;
        font-weight: 500;
        color: rgb(117, 117, 117);
        overflow-wrap: break-word;
        text-decoration-line: none;
        display: block;
        margin-top:10px;
        white-space: nowrap;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .jJdLlm.seller .categoryname{
        white-space: nowrap;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .jJdLlm{
        width:100%;
        border-radius: 8px;  
    }
    .jJdLlm > div{
        width: 33%;
        height: 120px;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        cursor: pointer;
        /* display: inline-block; */
        float: left;
        text-align: center;
    }
    .jJdLlm.editcateselect{
        margin-bottom: 15px;
    }
    .jJdLlm.seller{
        float: left;
        margin-bottom:30px;
    }
    .jJdLlm.seller > div{
    float: left;
    }
    .category-deat {
        border: 1px solid #cecece;
        position: relative;
    }
    .category-deat img{
        width:56px;
        height:56px;
    }
    .category-deat .delete img{
        width:24px!important;
        height:24px!important;
        background: #fff;
        border-radius: 50%;
    }
    .category-deat{
        position: relative;
    }
    .category-deat .hgbg{
        position: relative;
        z-index: 9;
    }
    .hgbg{
        background-color: rgb(245, 245, 245);
        border: 1px solid rgb(189, 189, 189);
    }
    .category-deat .delete{
        top: -10px;
        right: 10px;
        z-index: 1;
        position: absolute;
        border-radius: 500em;
    /* background-color: white; */
    }
    .category-deat .delete button{
        box-shadow: none!important;
    }
    .category-deat.active{
        background-color: rgb(245, 245, 245);
        border: 1px solid rgb(189, 189, 189);
        position: relative;
        z-index: 9;
    }
    .category-deat.active .activetickvalue {
        background-image:url(${tickImg});
        opacity: 1;
        height: 30px;
        background-size: 50%;
        background-repeat: no-repeat;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
        background-position: center;
        top: -10px;
        right: 10px;
        z-index: 1;
        position: absolute;
        border-radius: 500em;
        background-color: white;
        width: 30px;
    }
    .catrgyr{
        position: relative;
        display: inline-block;
        margin: 18px 0px;
    }
    .djLvqt{
        cursor: pointer;
        display: inline-block;
        text-overflow: ellipsis;
        font-family: var(--theme-fontfamily);
        color: var(--subtheme-color);
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: var(--theme-color);
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 50px;
    }
    .djLvqt:hover{
        color:var(--subtheme-color) !important;
    }
    .conmess{
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .wrat{
        display: table-cell;
        vertical-align: middle;
    }
    .nopacke{
        text-align: center;
        margin-top: 20px;
    }    
    @media screen and (max-width: 768px){
        /* .ReactModal__Content.ReactModal__Content--after-open.slide-pane.slide-pane_from_right.some-custom-class{
            max-width: 100% !important;
        }
        .ReactModal__Content.ReactModal__Content--after-open{
            width: 100% !important;
        } */
        .dz-default .dz-clickable {
            padding: 20px 0;
        }
        .fottebtnd{
            position: static;
        }
        .innercongrat{
            width:100%;
        }
        .ReactModalPortal .slide-pane__close{
            margin-left: 5px;
        }
    }
`;

// DiscardPopup

export const DiscardPopup = styled(Modal)`
    position: fixed;
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    .discardPopup{
       padding: 10px;
    }
    .rm-space {
        margin: -20px;
    }
    .nn_cancel_btn{
        text-align: right;
    }
    .nn_cancel_btn button{
        border-radius: 3px; 
    }
    .nn_cancel_btn .nn_cancel_ok{
        background-color: var(--theme-color);
        color: #fff;
        font-size: 16px;
        margin-right: 15px;
        padding: 5px 12px;
        font-weight: 500;
    }
    .nn_cancel_btn button.close{
        background-color: #464e55;
        color: #fff;
        padding: 10px 12px;
        font-size: 16px;
        font-weight: 500;
        opacity: 1;
    }
    .modal-header .close{
        padding: 0px;
    }
    .nn_modal_header p{
        margin-bottom: 0px;
        font-size: 20px;
        font-weight: bold;
    }
    .nn_cancel_order p{
        margin-bottom: 0px;
        font-size: 18px;
        font-weight: 500; 
    }
    .modal-body .nn_close_input{
        margin: 1.5em 0 1em;
        &::after{
            border-bottom: 2px solid var(--theme-color);
        }
    }
    .nn_discard_btn,.nn_share_title{
        text-align: center;
    }
    .nn_popup_title{
        font-weight: bold;
        font-size: 17px;
        text-align: center;
    }
    .nn_discard_btn .btn1,.nn_discard_btn .btn2{
        margin: 10px 10px;
    }
    .nn_popup_title1{
        font-weight: bold;
        font-size: 17px;
        margin-bottom: 20px;
    }
    .nn_popup_title2{
        font-weight: bold;
        font-size: 17px;
        margin: 15px 0px 0px;
    }
    .nn_report_title{
        font-weight: bold;
        font-size: 17px;
        margin: 15px 0px 20px;
    }
    .imgbgclg{
        margin-top: 10px;
        margin-right: 10px;
        width: 16px
    }
    .jJdLlm.seller{
        float: left;
        margin-bottom:30px;
    }
    .jJdLlm.seller > div{
    float: left;
    }
    .sesslesubmit{
        margin-top: 30px;
    }
    .chng-loc{
        font-size: 20px;
        font-weight: 700;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: rgb(44, 44, 44);
    }
    .nn_input::after,.botnbtn div[class*=" MuiInput-underline-"]::after{
        border-bottom: 2px solid var(--theme-color);
    }
    .kPEHgG .form-control,.kPEHgG .form-control:focus,.copyfunction,.copyfunction:focus{
        box-shadow: none;
        outline: none;
        border: none;
    }
    .closebuttonissues {
        width: 100%;
        display: inline-block;
        margin-bottom:25px;
    }
    .botnbtn{
        text-align: center;
    }
    .brbtn{
        margin-top:20px;
        text-align: center;
    }
    .dv-star-rating label{
        font-size:15px;
        color: var(--theme-color) !important;
    }
    .category-deat {
        border: 1px solid #cecece;
        position: relative;
    }
    .category-deat img{
        width:56px;
        height:56px;
    }
    .category-deat .delete img{
        width:24px!important;
        height:24px!important;
        background: #fff;
        border-radius: 50%;
    }
    .category-deat{
        position: relative;
    }
    .category-deat .hgbg{
        position: relative;
        z-index: 9;
    }
    .hgbg{
        background-color: rgb(245, 245, 245);
        border: 1px solid rgb(189, 189, 189);
    }
    .category-deat .delete{
        top: -10px;
        right: 10px;
        z-index: 1;
        position: absolute;
        border-radius: 500em;
    /* background-color: white; */
    }
    .category-deat .delete button{
        box-shadow: none!important;
    }
    .category-deat.active{
        background-color: rgb(245, 245, 245);
        border: 1px solid rgb(189, 189, 189);
        position: relative;
        z-index: 9;
    }
    .category-deat.active .activetickvalue {
        background-image:url(${tickImg});
        opacity: 1;
        height: 30px;
        background-size: 50%;
        background-repeat: no-repeat;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;
        background-position: center;
        top: -10px;
        right: 10px;
        z-index: 1;
        position: absolute;
        border-radius: 500em;
        background-color: white;
        width: 30px;
    }
    .catrgyr{
        position: relative;
        display: inline-block;
        margin: 18px 0px;
    }
    .nn_modal_header p {
        margin-bottom: 0;
        font-size: 20px;
        font-weight: 700;
    }
    .nn_cancel_order p {
        margin-bottom: 0;
        font-size: 18px;
        font-weight: 500;
    }    
    .fKYHrH > h1 {
        font-size: 40px;
        text-align: center;
    }
    .fKYHrH{
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    .innercongrat {
        margin-left: auto;
        margin-right: auto;
        width: 400px;    
    }
    .innercongrat h1{
        text-align: center;
        margin-top:20px;
    }
    .paywish .innercongrat{
        width:525px!important;
    }
    .paymentactive{
        background-color: var(--theme-color)!important;
        color: var(--subtheme-color)!important;
    }   
    .innercongrat .paymentwrapper{
        margin-top: 25px;
    }
    .innercongrat .paymenttitle.titlebgspsce{
        margin-bottom:15px;
    }
    .cls_paymodal .fKYHrH{
        position: initial !important;
    }
    .cls_paymodal .fixedpayment{
        position: relative;
        left: 0;
        top: 45%;
    }
    .cls_paymodal .modal-header .close{
        padding: 1rem 1rem;
        margin: -1rem -1rem -1rem auto;
        color: var(--theme-color)!important;
    }
    .stripedf{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .cls_stripe{
        text-align: left;
        margin: 0;
    }
    .cls_stripe label{
        margin-bottom: 20px;
    }
    .cls_stripe button {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        margin-top: 20px;
        padding: 7px 32px;
    }
    .StripeElement {
        box-sizing: border-box;
        height: 40px;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }
    .StripeElement--focus {
        box-shadow: 0 1px 3px 0 #cfd7df;
    }
    .StripeElement--invalid {
        border-color: #fa755a;
    }
    .StripeElement--webkit-autofill {
        background-color: #fefde5 !important;
    }
    .PaypalExpressBtn{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .upload-btn-wrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
    }
    .upload-btn-wrapper .btn {
        color: #fff;
        box-shadow: 0 2px 2px 0 rgba(233, 30, 99, 0.14), 0 3px 1px -2px rgba(233, 30, 99, 0.2), 0 1px 5px 0 rgba(233, 30, 99, 0.12);
        background-color: var(--theme-color);
        padding: 8px 20px;
    }  
    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
    .previewfilenameup{
        display: inline-block;
        vertical-align: top;
        margin-left: 20px;
        margin-top:10px;
    }
    .reporlst{    
        cursor: pointer;
        display: inline-block;
        text-align: center;    
        white-space: nowrap;   
        text-overflow: ellipsis;    
        font-family: var(--theme-fontfamily);    
        color: var(--subtheme-color);
        width: auto;
        height: 40px;
        font-size: 16px;
        font-weight: 500;    
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: var(--theme-color);
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        margin-right:10px;
    }
    .reporcl{    
        cursor: pointer;
        display: inline-block;
        text-align: center;  
        white-space: nowrap;   
        text-overflow: ellipsis;  
        font-family: var(--theme-fontfamily);    
        width: auto;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-color);
        border-image: initial;
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: white;
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        border-color: var(--theme-color);
        border-width: 1px;
        border-style: solid;
    }
    .iHQQug article {
        padding-bottom: 24px;
    }
    .iDhWYa{
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        font-family: var(--theme-fontfamily);
        width: 100%;
        height: 40px;
        font-size: 16px;
        font-weight: 500;
        color: var(--theme-color);
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: white;
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        border-color: var(--theme-color);
        border-width: 1px;
        border-style: solid;
    }
    .iDhWYa:hover{
        color: #fff;
        background-color: var(--theme-color-hvr);
    }
    .jJdLlm.seller .categoryname{
        white-space: nowrap;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .jJdLlm{
        width:100%;
        border-radius: 8px;  
    }
    .jJdLlm > div{
        width: 33%;
        height: 120px;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        cursor: pointer;
        /* display: inline-block; */
        float: left;
        text-align: center;
    }
    .jJdLlm.editcateselect{
        margin-bottom: 15px;
    }
    .jJdLlm.seller{
        float: left;
        margin-bottom:30px;
    }
    .jJdLlm.seller > div{
    float: left;
    }
    .discardPopup {
        width: 360px;
    }
    .discardPopup h3 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 26px;
    }
    .nn_discardPopup{
        width: 100%;
    }
    .nn_discardPopup h3,.discardPopup h3,.nn_postlist_ctn h3{
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 0px;
    }
    .nn_discardPopup,.discardPopup,.nn_article {
        text-align: center;
    }
    .nn_share_ctn{
        text-align: right;
    }
    .nn_close_btn .nn_close_icon{
        color: var(--theme-color);
    }
    .nn_close_btn {
        text-align: right;
        float: right;
        vertical-align: middle;
    }
    .nn_share_title h3 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
    .bg-color-media{
        background-color: rgb(63, 91, 150);
        padding: 10px;
        border-radius: 32px;
        color: #fff;
        cursor: pointer;
    }
    .textareafiled div[class*= " MuiInput-underline-"]::after,
    .nn_dropdown_payment div[class*= " MuiInput-underline-"]::after,.nn_reviewtext >::after,.nn_dropdown_payment >::after{
        border-bottom: 2px solid var(--theme-color);
    }
    .nn_dropdown_payment label[class*= " MuiFormLabel-focused-"]{
        color: var(--subtheme-color);
    }
    .kPEHgG{
        width: 100%;
        box-shadow: rgba(46, 60, 73, 0.05) 0px 2px 2px 0px;
        margin-bottom: 24px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(224, 224, 224);
        border-image: initial;
        border-radius: 6px;
        padding: 5px 16px;
    }
    .bg-color-media.whatsapp{
        background-color:rgb(4, 167, 78)!important;
        margin-top: 0px;
        padding: 3px;
    } 
    .bg-color-media.whatsapp svg{
        width: 40px;
        height: 40px;
    }
    .copyfunction{
        color: var(--theme-color);
        font-size: 14px;
    }
    .twittebg{
        background: #fff;
        border-radius: 50%;
    }
    .twittericon{
        color: rgb(29, 202, 255);
        margin-top: 10px;
    }
    .envelopeicon{
        color:rgb(223, 74, 50);
        margin-top: 10px; 
    }
    .nn_whatsapp_icon{
        background-color: rgb(4, 167, 78)!important;
        margin-top: 0px;
        padding: 3px;
    }
    .soc-icon {
        width: auto;
    }
    .nn_markclose_btn{
        text-align: right;
        color: var(--subtheme-color);
        font-size: 24px;
        padding: 15px 30px;
    }
    .nn_share_icon{
        display: inline-block;
        margin: 10px;
    }
    .nn_social_link{
        margin-top: 15px;
        display: block;
        margin: 0 auto;
        text-align: center;
    }
    .sav_chang.paymentchng{
        text-align: center;
    }
    .sav_chang.paymentchng .btn-danger{
        padding: 5px 20px!important;
    }
    .sav_chang.paymentbtnres{
        width:100%;
        float: left;
        margin-bottom: 15px;
    }
    .btn1, .btn2{
        border-radius: 24px;
        padding: 8px 20px;
        line-height: 1;
        font-size: 16px;
        font-weight: bold;
        min-height: 40px;
        letter-spacing: .2px;
    }
    .btn1 {
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        border: 1px solid var(--theme-color);
    }
    .btn2 {
        color: var(--theme-color);
        border: 1px solid var(--theme-color);
        background-color: #FFF;
    }
    .mt1{
        margin-top: 14px;
    }
    .congratls{
        width: 100%;
        float: left;
        margin: 15px 0px;
        text-align: center;
    }
    .congratls h4{
        font-size: 20px;
    }
    .congratls h6{
        font-size: 14px;
        font-weight: normal;
        color: #565050;
    }
    .smileiconsjj{
        text-align: center;
        margin-top: 10px;
    }
    .smileiconsjj img{
        width: 50px;
    }
    .border-bottomline{
        width: 100%;
        float: left;
        border-bottom:1px solid #f3ebeb;
    }
    .makepop{
        width:100%;
        float: left;
        /* padding: 15px 20px; */
    }
    .rightmakeit{
        width:10%;
        float: left;
    }
    .rightmakeit img{
        width: 50px;
        border-radius: 50%;
        height:50px;
    }
    .leftmakeit{
        width:90%;
        float: left;
        margin-top:10px;
        font-weight: 500;
    }
    .belowspave{
        margin-bottom: 20px;
        width: 100%;
        float: left;
    }
    .reviewitmeddd p{
        font-size: 14px;
        font-weight: normal;
        color: #565050;
    }
    .reviewitmeddd{
        padding: 5px 20px;
        margin-top: 10px;
    }
    .ratingprofile{
        width: 100%;
        float: left;   
    }
    .ratingprofile img{
        width:50px;
        border-radius: 50%; 
        height:50px; 
    }
    .ratingpageki{
        text-align: center;
        padding: 20px;
    }
    .profilerayingname{
        width: 100%;
        margin: 15px 0px;
        float: left;
        font-weight: 500; 
    }
    .ratingdescription{
        width: 100%;
        float: left; 
    }
    .ratingdescription p{
        font-size: 14px;
        font-weight: normal;
        color: #565050;
    }
    .inlienbtnvalue{
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        color: var(--theme-color);
        font-weight: 800;
    }
    .inlienbtnvalue .iDhWYa{
        font-size:14px!important;
    }
    .productfeature, button.iDhWYa.active{
        color: #fff;
        background-color: var(--theme-color);
    }
    .slaectvalue{
        margin-bottom:20px;
    }
    .upadteyoureview{
        margin-top:15px;
    }
    .textareafiled{
        margin-top: 50px;
        margin-bottom: 50px;
        width: 100%;
        float: left;
    }
    .nochatuser{
        height: 200px;
        position: relative;
        padding: 15px;
    }
    .centeralignnochat{
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
    .centeralignnochat h6{
        margin-bottom: 15px;
        text-transform: uppercase;
    }
    .centeralignnochat .sav_chang{
        margin-top: 15px;
        width: 100%;
        float: left;
    }
    .sav_chang .btn-danger,.nn_pay_btn{
        background: var(--theme-color)!important;
        border-radius:32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus,.nn_pay_btn:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    .sav_chang.cancee{
        margin-bottom: 15px;
    }
    .fullwidthuserrwe{
        width:100%;
        float: left;
        padding: 15px 20px;
    }
    .highrwbf{
        color:var(--theme-color);
    }
    .timelinerew{
        font-size:14px!important;
        color: rgb(117, 117, 117);
    }
    .afterdisbaled {
        pointer-events: none;
        opacity: 0.5;
    }
    .sharepop{
        margin-bottom: 15px;
    }
    .react-swipeable-view-container>div>div, .react-swipeable-view-container form{
        padding: 0 16px;
    }
    .uploadbanne img{
        width: 350px!important;
        height: 100px!important;
    }
    .uploadbanne.Mobile img{
        width: 250px!important;
        height: 90px!important;   
    }
    .location-close.ltn.revw{
        padding: 20px;
    }
    .location-close.ltn{
        background: transparent;
        border: none;
        line-height:1;
    }
    .location-close{
        color: var(--theme-color);
        font-size: 30px;
        margin-right: 20px;
        opacity: 1;
    }
    .nn_loc_btn{
        text-align: right;
        float: right;
        vertical-align: middle;
    }
    .ovarsoculaspave{
        width:100%;
        float: left;
        padding:30px;
        padding-top: 15px;
    }
    .social-link svg {
        fill: #FFF;
    }
    .social-link .email svg {
        height: 19px;
        fill: #df4a32;
    }
    .social-link .twitter svg {
        fill: #48cbff;
        height: 19px;
    }
    .LocationPopup .nn_modal{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1em 0 1.5em;
        span{
            font-size: 1.16em;
            font-weight: 600;
        }
        .nn_close_icon{
            fill: var(--theme-color);
            color: var(--theme-color);
        }
    }
    .LocationPopup .searchfield{
        display: flex;
        border:1px solid rgb(148, 148, 148);
        border-radius: 20px;
        position: relative;
        width: 100%;           
    }
    .LocationPopup .searchfield .searchctn{
        position: relative;
        display: flex;
        width:100%;        
    }
    .LocationPopup .searchfield .searchctn .searchicon{
        margin: 4px 0px 0px 10px;
        color: rgb(148, 148, 148);
        fill: rgb(148, 148, 148);
        width: 24px;
        height: 24px;
    }
    .LocationPopup .searchfield .searchctn .searchinput{
        background-color: transparent;
        padding: 0px 35px 0 5px;
        width: 100%;
        border-radius: 2px;
        border: none;
        height: 35px;
        color: rgb(97, 97, 97);
        overflow: visible;
    }
    .LocationPopup .searchfield .searchctn .nn_locIcon{
        margin: 4px 0px 0px 10px;
        color: rgb(148, 148, 148);
        fill: rgb(148, 148, 148);
    }
    .LocationPopup .searchfield.nn_search .searchctn .nn_locIcon{
        margin: 4px 6px 0px 10px;
    }
    .LocationPopup .searchfield .searchctn{       
        img{
            display: none;
        }
        .nn_locationDropdown{
            padding: 0.5em 1em;
            &:hover{
                background: var(--theme-color-hvr);
                color: #fff;
                font-weight: 800;
            }
        }
        .searchinput + div{
            box-shadow: 1px 1px 8px 1px rgba(0,0,0,0.09);
            margin-top: 5px;
            background: #fff;
        }
    }
    .LocationPopup .searchfield .searchinput:focus{
        outline: none;
    }
    .LocationPopup .searchfield .closeicon{
        position: absolute;
        right: 0px;
        background-color: #fff;
        width: 20px;
        height: 20px;
        border-radius: 24px;
        border: none;
        padding: 0px;  
        margin-right: 10px;
        margin-top: 7px; 
    }
    .LocationPopup .searchfield .closeicon svg{
        width: 14px;
        height: 14px;
        fill: var(--theme-color);
        margin-top: -4px;
    }
    .textArea1 {
        width: 100%;
        margin-bottom: 1em;
    }
    .textArea1 >::after{
        border-color: var(--theme-color) !important;
    }
    .nn_close_popup{
        display: flex;
        align-items: center;
        justify-content: space-between;
        h5{
            margin-bottom: 0px;
        }
        .nn_close_btn1{
            .nn_close_icon{
                color: var(--subtheme-color);
            }
        }
    }
    @media (min-width: 992px){
        .ReactModal__Content.ReactModal__Content--after-open{
            max-width: 500px;
            margin: 0 auto;
            bottom: auto !important;
            border: none !important;
            width: auto !important;
        }
    }
    @media screen and (max-width: 991px){
        .discardPopup{
            width:100%!important;
        }
        .rightmakeit.respnsive{
            width: 20%;
        }
        .leftmakeit.respnsive{
                width: 80%; 
                margin-top:15px;
            }  
        }
    @media screen and (max-width: 768px){
       &{
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
            z-index: 999;
        }
        .innercongrat{
            width:100%;
        }
    }
`;

// login popup
export const LoginPopup = styled(Modal)`
    max-width: 800px !important;
    margin: 0 auto;
    bottom: auto !important;
    border: none !important;
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    .nn_social,svg.sc-kGXeez.Pdhue{
        display: none;
    }    
    .Snackbar{
        background-color: var(--theme-color)!important;
    }
    .noruse{
        color:#f44336 ;
        font-size: 0.75rem;
    }
    .nn_email::after,.nn_password::after,.nn_fullmame::after{
        border-color: var(--theme-color);
    }
    .loginRight{
        width:55%;
        padding-bottom: 20px;
    }
    .cls_apple{
        background-color: #000;
    }
    .resnoban, .loginRight{
        display: table-cell;
        vertical-align: top;
    }
    .bGYxuY.nn_active{
        display: block;
    }
    .pos_rel.viewPsw{
        position: relative;
    }
    .viewPsw button {
        position: absolute;
        right: 0;
        top: 28px;
        fill: rgb(187, 187, 187);
        cursor: pointer;
        background: transparent;
        border: none;
        z-index: 1;
    }
    .viewPsw button>svg {
        position: relative;
        z-index: -1;
    }
    .viewPsw button.showw>svg {
        fill: var(--theme-color);
    }
    .loginRight.nn_noactive{
        padding-top: 100px;
    }
    .loginRight.nn_active{
        padding-top: 0px;
    }
    .loginPopup {
        margin: -20px;
        display: table;
    }
    .loginUl {
        padding: 0;
        margin: -14px 0 10px;
    }
    .responsive{
        max-width: 100%;
    }
    .restpss{
        color: rgba(0,0,0,.6);
        font-size: 14px;
        letter-spacing: .3px;
        line-height: 1.3;
        margin: 25px 0 10px;
    }
    .loginpo{
        padding: 130px 30px;
        color:#fff;
    }
    .close-Id svg{
        color:#fff;
    }
    .unlock-poup{
        font-weight: 800;
        font-size: 26px;
        margin-bottom: 32px;
        line-height:35px;
    }
    .thankmsg{
        margin-top: 30px;
    }
    .textArea {
        width: 100%;
    }
    .textArea div[class*=" MuiInput-underline-"]:after{
        border-color: var(--theme-color);
    }
    .text-alignpg{
        text-align: left;
    }
    .loginpo ul li {
        list-style: none;
        font-size:19px;
    }
    .loginpo ul {
        padding:0px;
    }
    .loginpo ul li span{
        padding-right: 15px;
    }
    .tJBQs{box-sizing: border-box;
        margin-left: calc(-6px);
        margin-right: calc(-6px);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        -webkit-box-pack: start;
        justify-content: flex-start;
        -webkit-box-align: stretch;
        align-items: stretch;
        align-content: stretch;
        margin-top:8px;
        margin-bottom: 8px;
    }
    .iconsvg{
        box-sizing: border-box;
        display: block;
        padding-left: calc(6px);
        padding-right: calc(6px);
        align-self: auto;
        flex: 0 0 auto;
    }
    .iconsvg svg{
        color: #fff;
        fill: #fff;
    }
    .langsel{
        box-sizing: border-box;
        display: block;
        padding-left: calc(6px);
        padding-right: calc(6px);
        align-self: auto;
        flex: 1 1 0%;
        font-size: 19px;
    }
    .popupLogo{
        margin-top: 20px;
    }
    h2.quickbuy{
        margin-bottom: 10px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.6);  
        font-weight: normal;
        margin-top: 20px;
    }
    .bGYxuY h3 .dash{
        display: block;
        height: 6px;
        padding: 0;
        border-bottom: 1px solid rgb(227, 227, 227);  
    }
    .bGYxuY h3 .dash span {
        padding: 0 6px;
        background: rgb(255, 255, 255);
        font-weight: normal;
        color: rgb(153, 153, 153);
        font-size: 14px;
        line-height: 14px;
    }
    .bGYxuY h3{
        margin-bottom: 30px;
    }
    .loginContent{
        padding: 12px;
    }
    .unlocklogin {
        font-size: 16px;
        color: rgb(97, 97, 97); 
        margin-bottom:15px;
    }
    .loginfeate{
        margin-top:25px;
    }
    .jHTwzI{
        box-sizing: border-box;
        margin-left: calc(-6px);
        margin-right: calc(-6px);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: stretch;
        align-items: stretch;
        align-content: stretch;
    }
    .fGPScD{
        box-sizing: border-box;
        display: block;
        padding-left: calc(6px);
        padding-right: calc(6px);
        align-self: auto;
        text-align: center;
        flex: 1 1 0%;
    }
    .kwtHbv {
        box-sizing: border-box;
        width: 40px;
        height: 40px;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        color: rgb(148, 148, 148);
        font-size: 12px;
        background-color: rgb(238, 238, 238);
        border-radius: 32px;
        margin: 8px auto;
    }
    .hHLSvC {
        color: rgb(97, 97, 97);
        font-size: 12px;
    }
    .loginfeate{
        display: none;
    }
    .ove_all{
        padding:10px;
    }
    .ove_all ul {
        padding: 0px;
    }
    .whclg{
        font-size: 16px;
        font-weight: 500;
        color:#fff
    }
    .ove_all ul li{
        cursor: pointer;
    }
    .signuinbtn{
        font-size: 16px;
        font-weight: bold;
        color: var(--theme-color);  
        text-transform: capitalize;
    }
    p.footer-trms a{
        color:#757575!important 
    }
    p.footer-trms a:hover{
        text-decoration: none;
    }   
    .logtn{
        text-align: center;
    }
    .fogpg {
        color: rgb(120, 120, 120);
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        text-transform: capitalize;
    }
    .alredy{
        color: rgb(243, 63, 85);
        cursor: pointer;
        font-size: 14px;
        text-transform: capitalize;
    }
    .logtn button{
        padding:0px;
    }
    .notFoundProduct{
        text-align: center;  
        width: 100%;
        height: 800px;
        padding-top: 150px;
        h5,h6{
            margin: 1em;
        }
    } 
    .logbtnss{   
        -webkit-appearance: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;      
        text-overflow: ellipsis;
        font-family: var(--theme-fontfamily);
        color: var(--subtheme-color);
        width: auto;
        line-height:46px;
        font-size: 16px;
        font-weight: 500;
        outline: none;
        text-decoration: none;
        overflow: hidden;
        margin: 0px;
        background: var(--theme-color);
        transition: background-color 0.25s ease 0s;
        padding: 0px 1.4rem;
        border-radius: 100em;
        text-transform: capitalize;
    }
    .dtgBrv {
        display: flex;
        flex-direction: row;
        -webkit-box-pack: justify;
        justify-content: space-between;
        margin-bottom: 15px;
        margin-top:10px;
    }
    .diFwKh{
        position: relative;
        left: 15px;
        font-size: 16px;
        font-weight: normal;
    }
    .whbr{
        display: block;
        margin-inline-start: 2px;
        margin-inline-end: 2px;
        padding-block-start: 0.35em;
        padding-inline-start: 0.75em;
        padding-inline-end: 0.75em;
        padding-block-end: 0.625em;
        min-width: -webkit-min-content;
        border-width: 2px;
        border-style: groove;
        border-color: threedface;
        border-image: initial
    }
    .meg-cre{
        color: #f44336 ;
        font-size: 0.75rem;
    }
    .googleadpr{
        text-align: center; 
        margin-bottom: 30px;
    }
    .fvALSw a{color: rgb(33, 33, 33);
        cursor: pointer;
        text-decoration: none;
    }
    .fvALSw{
        color: rgb(33, 33, 33);
        text-align: right;   
    }
    .fvALSw {
        color: rgb(33, 33, 33);
        cursor: pointer;
        flex-direction: column;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        box-sizing: border-box;    
    }
    .fvALSw.hghelp{
        padding:15px;
    }
    .fvALSws{
        color: #212121;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    .fvALSw.hghelp{
        padding:0px;
    }
    .addbanner .none{
        display: block!important;
    }
    /* .ReactModal__Content.ReactModal__Content--after-open{
        max-width: 800px;
        margin: 0 auto;
        bottom: auto !important;
        border: none !important;
    } */
    @media screen and (max-width: 991px){
        .loginRight.nn_noactive{
            padding-top: 0px;
        }
        .loginRight{
            display: block !important;
            width:100%!important;
        }
        svg.sc-kGXeez.Pdhue{
            display: block!important;
        }
        .resnoban{
            display: none;
        }
        &{
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
        }             
    }
    @media (min-width: 769px) and (max-width: 991px) {
        .loginPopup{
            margin:0px!important;
            width:100%!important;
        }
    }
    @media screen and (max-width: 767px){
        .loginPopup{
            margin:0px;
            display: block;
        }   
        .dtgBrv{
            margin-top:0px;
        } 
        .quickbuy{
            display: none;
        }
        .bGYxuY h3{
            margin-bottom: 50px;
        }     
        .notFoundProduct{           
            height: 100%;
            padding-top: 0px;            
        }     
    }   
`;

// OrderViewPage
export const OrderViewPage = styled.div`
    .cls_orderview{
        background-color: #f6f5f7;
        padding: 30px 0px 0px;
        display: inline-block;
        width: 100%;
    }
    .cls_orderview .cls_product_heading .cls-heading-text{
        font-size: 27px;
        font-weight: bold;
        margin: 0;
    }
    .cls_orderview .cls_product_heading .cls-heading-sub-text{
        font-size: 18px;
    }
    .cls_orderview .cls_orderall .cls_common{
        border-radius: 3px;
        background: #fff;
        height: auto;
        padding: 0px 10px;
    }
    .nn_order{
        margin-top: 32px !important;
    }
    .cls_orderprice{
        padding: 0 10px;
    }
    .cls_orderview .cls_orderall .cls_common h2{
        font-size: 22px;
        margin: 0;
        font-weight: bold;
        width: calc(100% - 215px);
        padding: 15px 10px;
    }
    .cls_orderview .cls_orderall .cls_common h3{
        font-size: 22px;
        margin: 0;
        font-weight: bold;
        padding: 15px 10px;
    }
    .cls_orderview .cls_orderall .cls_common button {
        color: var(--subtheme-color);
        background-color: var(--theme-color);
        padding: 8px 30px;
        border-radius: 3px;
        font-weight: 900;
    }
    .cls_orderview .cls_orderall .cls_common span {
        font-size: 16px;
        color: #222;
    }
    .cls_orderview .nn_ftmain{
        display: none;
    }
    .cls_address_view .cls_addlist {
        background-color: #fff;
        margin: 10px;
        padding: 10px;
        border-radius: 5px;
        border: 4px solid #fff;
        height: 360px;
        cursor: pointer;
        position: relative;
    }
    .cls_address
    {
        cursor: pointer;
    }
    .cls_address_view .cls_addlist:hover {
        border: 4px solid var(--theme-color);
    }
    .cls_address_view .cls_addlist.active {
        border: 4px solid var(--theme-color);
        position: relative;
    }
    .cls_address_view .cls_addlist.active:after {
        background:url(../../../assets/img/address-active.png) no-repeat scroll center center;
        position: absolute;
        top: -3px;
        right: 0;
        height: 37px;
        width: 36px;
        content: "";
    }
    .cls_address_view .cls_editdel {
        text-align: right;
        padding: 10px 30px;
    }
    .cls_address_view .cls_editdel img{
        margin-left: 8px;
        cursor: pointer;
    }    
    .cls_adddisplay p {
        margin:0px;
        font-size:16px;
    }
    .cls_adddisplay {
        max-height: 200px;
        overflow-y: auto;
        scroll-behavior: smooth;
        padding-bottom: 15px;
    }
    .cls_addlist h3 {
        font-size: 20px;
    }
    .cls_addlist button {
        background-color: var(--theme-color);
        display: block;
        color: var(--subtheme-color);
        padding: 8px 45px;
        border-radius: 5px;
        font-size: 16px;
        margin: 20px auto 0;
        font-weight: 900;     
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);   
    }  
    .cls_ordersummery .cls_orderimg{
        height: 156px;
        border-radius: 5px;
        border: 1px solid #ddd;
        background: #fff;
        text-align: center;
    }
    .cls_ordersummery .cls_orderimg img
    {
        height: 100%;
        object-fit: contain;
        background-color: #fff;
    }

    .cls_ordersummery .cls_ordertxt p
    {
        font-weight: bold;
        margin-bottom: 5px;
    }
    .cls_ordersummery .cls_ordertxt span
    {
        font-weight: 600;
        color: var(--subtheme-color);
    }
    .cls_orderprice p {
        text-align: right;
        margin-bottom: 5px;
    }
    .cls_orderprice p span{
        font-weight: 600;
    }
    .cls_orderbtn {
        text-align: right;
    }   
    .cls_paymentmethod .cls_orderimg
    {
        text-align: center;
        padding: 30px 0;
        width: 100%;
        border:2px solid #ddd;
        cursor: pointer;
    }
    .cls_paymentmethod
    {
        text-align:center;
        font-weight: 600;
    }
    .cls_paymentmethod .cls_orderimg img
    {
        height: 38px;
    }
    .radio-img
    {
        width: 100%;
        position: relative;
    }
    .radio-img  > input { 
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    .radio-img  > img{
        cursor:pointer;
        border:2px solid transparent;
    }
    .radio-img  > input:checked + .cls_orderimg{ 
        border:2px solid var(--theme-color);
    }
    .btn_theme{
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        padding: 8px 45px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 900;
    }
    .cls_ordertxt {
        padding: 0 10px;
    }
    .cls_emptyaddress {
        margin: 0 auto;
        text-align: center;
    }
    .cls_emptyaddress h1 {
        font-size: 22px;
        font-weight: bold;
        padding: 35px 0 20px;
    }
    .cls_emptyaddress button {
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        font-size: 16px;
        padding: 8px 30px;
        border-radius: 3px;
        margin-bottom: 35px;
    }
    .cls_delepop{
        text-align:center;
    }
    .discardPopup.cls_delepop p {
        font-size: 19px;
        font-weight: 600;
    }
    .cls_orderview_admin span {
        font-size: 16px;
        margin: 0 2px 0 0;
    }
    .cls_orderview_admin p {
        font-size: 16px;
    }       
`;

// OrderView popup 

export const OrderViewPopup = styled(Modal)`
    &{
        position: absolute;
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        border: 1px solid rgb(204, 204, 204);
        background: rgb(255, 255, 255);
        overflow: auto;
        border-radius: 4px;
        outline: none;
        padding: 20px;
        margin: 0px;
        transform: translate(-50%, -50%);
        width: 500px;
        height: calc(100% - 20px);
    }
    .cls_pophead {
        border-bottom: 1px solid #ddd;
        padding-bottom: 12px;
        background-color: #fff;
    }
    .cls_popclose
    {
        display: inline;
        float:right;
    }
    .location-close.ltn.revw{
        padding: 20px;
    }
    .location-close.ltn{
        background: transparent;
        border: none;
        line-height:1;
    }
    .location-close{
        color: var(--theme-color);
        font-size: 30px;
        margin-right: 20px;
        opacity: 1;
    }
    .cls_addaddress .form-group {
        margin-bottom: 0;
        margin: 0px 0 6px;
    }
    .nn_validatcolor{       
        color: #f54a61;
        font-size: 22px;
        line-height: 1;
        vertical-align: bottom;
        margin-left: 3px;
    }
    .validatcolor{
        color: #f54a61;
    }
    .cls_addaddress .cls_from_ctrl {
        padding-top: 0;
        margin: 0;
        border: 1px solid #D2D2D2;
        border-bottom: none;
        border-radius: 5px
    }
    .cls_from_ctrl > div::after{
        border-bottom: 2px solid var(--theme-color) !important;
    }
    .btn_cancel {
        background-color: #484848;
        color: #fff;
        padding: 8px 45px;
        border-radius: 5px;
        font-size: 16px;
        margin-left: 5px;
    }
    .btn_theme
    {
        background-color: var(--theme-color);
        color: var(--subtheme-color);
        padding: 8px 45px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 900;
    }
    .btn:hover{
        color: var(--subtheme-color);
        text-decoration: none;
    }
    @media (max-width: 991px){
        &{
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
        }
    }
`;

// StaticPage

export const StaticPage = styled.div`
    .contactsdee{
        margin-top:60px;
        background: #f7f4f4 url(../../../assets/img/pttrn-bg.png);
        border-bottom: 1px solid #efefef;
        overflow: hidden;
        padding: 50px;
        text-align: center;
    }
    .contacuslabel{
        color:#333!important;
    }
    .contsave{
        margin-top:20px;
    }
    .newcontacrf{
        margin-top:50px;
    }
    .conactvw{
        width:60%;
        margin:0 auto;
        box-shadow: 0 2px 4px rgba(0,10,18,.12), 0 0 1px hsla(0,0%,96.5%,.5);
        background:#fff;
        padding: 50px;
        border-radius: 8px;
    }
    .colorlgbn{
        color:#757575;
        padding-left: 15px;
    }
    .nn_name div:first-child div::after,.nn_email div:first-child div::after,.nn_feedback div:first-child div::after{
        border-color: var(--theme-color);
    }
    .contheadve{
        text-align: left;
        padding-left: 15px;
    }
    .message.conts{
        color:#757575;
        font-size: 14px
    }
    h4.contstitle{
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;
        margin: 0 0 8px;
        color: #212121;
    }
    h1.clonestylee{
        font-size: 40px;
        font-weight: bold;
        text-align: center;
        margin: 30px 0px;
    }
    .headingterms h2{
        font-size: 21px;
        margin: 20px 0px;
    }
    .headingterms{
        font-size: 15px;
        font-weight: lighter;
        line-height: 1.75;
        color: rgb(51, 51, 51);
    }
    .salesint a{
        color: var(--subtheme-color);
        text-decoration: none;
    }
    .nn_service{
        font-size: 16px;
        margin: 88px 0px 20px !important;
    }
    .priourpg {
        font-size: 16px;
        margin: 0px 0 16px;
    }
    .priourpg h1{
        font-size: 40px;
        font-weight: bold;
        text-align: center;
        margin: 0px 0px 30px;
        padding-top: 30px;
    }  
    .headingterms{
        padding-bottom: 50px;
    }
    .validatcolor{
        color: #f54a61;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    /*end contact Us*/
    @media screen and (max-width: 991px){
        .conactvw{
            width:100%
        }
        .contactsdee{
            padding: 50px 0px;
        }
    }
    @media screen and (max-width: 767px){
        .nn_container{
            padding: 0px 15px 0px 15px !important;
        }
        h1.clonestylee,.nn_service h1{
            font-size: 28px;
        }
    }
`;

// FeaturedModal

export const FeaturedModal = styled(Modal)`    
    .nobgforpayment {
        background-color: transparent;
        border: none;
        font-size: 30px;
        color: var(--subtheme-color);
        line-height: 20px;
        position: relative;
        z-index: 99;
    }
    .nobgforpayment.productdets{
        position: relative;
    }
    .nobgforpayment.productdets .clsbtn{
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;    
        background-color: #fff;
        width: 100%;
        height: 60px;
        opacity: 1;
        padding: 7px 0;
        text-align: center;
        z-index: 98;
        position: fixed;
    }
    .clsbtn:hover{
        color:var(--theme-color);
        opacity: 1;
    }
    .paymenttitle.titlebgspsce h6{
        color: rgb(117, 117, 117);
    }
    .subclfprdet{
        width:40px;
        height: 40px;
        box-shadow: rgba(246, 246, 246, 0.5) 0px 0px 1px 0px, rgba(0, 10, 18, 0.12) 0px 2px 4px 0px;
        margin-left: -25px;
        border-radius:50%;
        background-color: #fff;
        cursor: pointer;
    }
    .subclfprdet svg{
        width: 24px;
        margin-top: 8px;
        fill: rgb(189, 189, 189);
    }
    .paymentwrapper{
        width:100%;
        float: left;
        text-align:center;
        margin-top:85px;
        /* height: 700px!important;
        overflow-y: scroll!important; */
    }
    .paymenttitle{
        width:90%;
        /* float: left; */
        margin:0 auto;
        text-align:center;
    }
    .paymenttitle h5{
        font-size: 18px; 
    }
    .paymenttitle img{
        width: 25px;
        padding-right: 10px; 
    }
    .paymenttitle.titlebgspsce{
        margin-bottom:20px;
    }
    .payloadingcss{
        position: relative;
    }
    .fixedpayment {
        text-align: center;
        vertical-align: middle;
        position: fixed;
        left: 40%;
        top: 40%;
    }
    .nobtnvw{
        display: none;
    }
    .centeralignteactbuy{
        width:100%;
        float: left;
        padding: 15px 35px;
        /* text-align: center;    */
    }
    .tabcontebt {
        width: 100%;
        float: left;
    }
    .jss799.btncolorchange{
        background: var(--theme-color);
        color: #fff!important;
    }
    .btncolorchange{
        border-bottom: none!important;
        margin-right: 15px!important;
        border-radius: 32px!important;
        padding: 5px!important;
        color: var(--theme-color);
        font-weight: bold!important;
        border-top: 1px solid var(--theme-color)!important;
        border-left: 1px solid var(--theme-color)!important;
        border-right: 1px solid var(--theme-color)!important;
        border-bottom: 1px solid var(--theme-color)!important;
        margin-bottom:10px;
        text-align: center;
    }
    .reactbuy {
        width:100%;        
        padding: 15px 35px;
        text-align: center;
    }
    .reactbuy ul li{
        display: inline-block;
        width:25%;
        cursor: pointer;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .reactbuy.centeralignteactbuy ul {
        padding: 0px;
        text-align: center;
    }
    .paymentactive {
        background-color: var(--theme-color)!important;
        color: var(--subtheme-color)!important;
    }
    .sav_chang.paymentchng{
        text-align: center;
    }
    .sav_chang.paymentchng .btn-danger{
        padding: 5px 20px!important;
    }
    .sav_chang.paymentbtnres{
        width:100%;
        float: left;
        margin-bottom: 15px;
    }
    .sav_chang.paymentbtnres {
        width: 100%;
        margin-bottom: 15px;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    .tabcontebt p{
        color: rgb(117, 117, 117);
        font-size: 14px;
        font-weight: normal;
    }
    .tabcontebt h5{
        margin-bottom:20px;
    }
    .tabimgvw{
        width:100%;
        float: left;
    }
    .centealgnimg{
        width:100%;
        float: left;
        padding:25px;  
    }
    .centealgnimg img{
        width:100%;
        height: 250px;
        object-fit: contain;
    }
    .cls_paymodal .fKYHrH{
        position: initial !important;
    }
    .cls_paymodal .fixedpayment{
        position: relative;
        left: 0;
        top: 45%;
    }
    .cls_paymodal .modal-header .close{
        padding: 1rem 1rem;
        margin: -1rem -1rem -1rem auto;
    }
    .stripedf{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .cls_stripe{
        text-align: left;
        margin: 0;
    }
    .cls_stripe label{
        margin-bottom: 20px;
    }
    .cls_stripe button {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        margin-top: 20px;
        padding: 7px 32px;
    }
    .StripeElement {
        box-sizing: border-box;
        height: 40px;
        padding: 10px 12px;
        border: 1px solid transparent;
        border-radius: 4px;
        background-color: white;
        box-shadow: 0 1px 3px 0 #e6ebf1;
        -webkit-transition: box-shadow 150ms ease;
        transition: box-shadow 150ms ease;
    }
    .StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
    }
    .StripeElement--invalid {
    border-color: #fa755a;
    }
    .StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
    }
    .PaypalExpressBtn{
        text-align: center;
        margin-bottom: 20px;
        margin-top: 20px;
    }
    .upload-btn-wrapper {
        position: relative;
        overflow: hidden;
        display: inline-block;
    }
    .upload-btn-wrapper .btn {
        color: #fff;
        box-shadow: 0 2px 2px 0 rgba(233, 30, 99, 0.14), 0 3px 1px -2px rgba(233, 30, 99, 0.2), 0 1px 5px 0 rgba(233, 30, 99, 0.12);
        background-color: var(--theme-color);
        padding: 8px 20px;
    }  
    .upload-btn-wrapper input[type=file] {
        font-size: 100px;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
    }
    .previewfilenameup{
        display: inline-block;
        vertical-align: top;
        margin-left: 20px;
        margin-top:10px;
    }
    .fKYHrH > h1 {
        font-size: 40px;
        text-align: center;
    }
    .fKYHrH{
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
    @media (min-width: 992px){
        .subclfprdet{
            margin-left: -20px;
        }
    }
    @media screen and (max-width: 991px){
        &{
            width: 100% !important;
            overflow-y: auto;
        }
        .subclfprdet{
            margin-left:0px;
        }
    }
`;


// ShipmentPopup

export const ShipmentPopup = styled(Modal)`
    position: absolute;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    margin: 0px;
    transform: translate(-50%, -50%);
    width: 500px;
    height: calc(100% - 20px);
    .rm-space {
        margin: -20px;
    }
    &.cls_addpayout_table
    {
        max-width: 800px !important;
        width: 100% !important;
        height:auto;
    }
    .custom-control-input:checked ~ .custom-control-label::before {
        color: #fff;
        border-color:  var(--theme-color);
        background-color:  var(--theme-color);
      }
    .nn_modal_header p {
        margin-bottom: 0;
        font-size: 20px;
        font-weight: 700;
    }
    .modal-header .close {
        margin: 0;
        color: var(--theme-color)!important;
        padding: 0px;
        opacity: 1;
    }
    .nn_validatcolor {
        font-size: 22px;
        line-height: 1;
        vertical-align: bottom;
        margin-left: 3px;
    }
    .nn_validatcolor, .validatcolor {
        color: #f54a61;
    }   
    .btn_theme {
        color: var(--subtheme-color);
        padding: 8px 45px;
        border-radius: 5px;
        font-size: 16px;
        background-color: var(--theme-color);
        font-weight: 900;
    }
    .btn:hover {
        color: var(--subtheme-color);
        text-decoration: none;
    }
    .nn_form_group{
        margin-bottom: 20px !important;
    }
    .nn_form_group:first-child label{
        padding-top: 5px;
    }
    .nn_form_group label{
        display: block;
        padding-top: 15px;
    }
    .nn_form_group textarea{
        resize: none;
    }
    .nn_form_group input,.nn_form_group textarea , .nn_form_group select, .nn_form_group .react-datepicker-wrapper{
        width: 100%;
    }
    .nn_form_group .nn_input{
        /* transform: scaleX(0); */
        transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms
    }
    
    .nn_form_group .nn_input,.nn_form_group textarea , .nn_form_group select{
        padding: 5px 10px !important;
        border: 1px solid #D2D2D2 !important;
        border-radius: 5px;
    }
    .nn_form_group textarea:focus{
        outline: none;
    }  
    .nn_form_group input:focus{
        border-bottom: 2px solid var(--theme-color) !important;
        outline: none;
        transform: scaleX(1);
    }
    .nn_form_group input[type="date"]{
        display:block;
        -webkit-appearance: textfield !important;
        -moz-appearance: textfield !important;
        min-height: 1.2em;   
    }   
    .nn_error_text {
        margin-top: -15px;
        margin-bottom: 0;
    }
    .nn_error_text small {
        font-size: 14px;
    }  
    @media screen and (max-width: 767px){
       &{
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
            z-index: 999;
        }
    }
`;

// LocationModal

export const LocationModal = styled(Modal)`
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid rgb(204, 204, 204);
    background: rgb(255, 255, 255);
    overflow: auto;
    border-radius: 4px;
    outline: none;
    padding: 20px;
    .location-close.ltn {
        background: transparent;
        border: none;
        line-height: 1;
    }
    .chng-loc {
        font-size: 20px;
        font-weight: 700;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #2c2c2c;
    }
    .jss134 {
        fill: currentColor;
        width: 1em;
        height: 1em;
        display: inline-block;
        font-size: 24px;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        user-select: none;
        flex-shrink: 0;
    }
    .nn_loc_btn {
        text-align: right;
        float: right;
        vertical-align: middle;
    }
    .location-close {
        color: var(--subtheme-color);
        font-size: 30px;
        opacity: 1;
    }
    .rangeslider{
        margin: 20px;
    }
    .rangeslider-horizontal .rangeslider__fill{
        background-color: var(--theme-color);
    }
    .rangeslider-horizontal .rangeslider__handle {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        top: 50%;
        -webkit-transform: translate3d(-50%,-50%,0);
        transform: translate3d(-50%,-50%,0);
    }
    .rangeslider .rangeslider__handle {
        background: #fff;
        border: 1px solid #ccc;
        cursor: pointer;
        display: inline-block;
        position: absolute;
        box-shadow: 0 1px 3px rgba(0,0,0,.4), 0 -1px 3px rgba(0,0,0,.4);
    }
    .nn_rangeslider .rangeslider__handle{
        margin-right: -30px;
    }
    .nn_rangeslider .rangeslider__labels .rangeslider__label-item{
        margin-right: -23px;
    }
    .nn_rangeslider .rangeslider__labels .rangeslider__label-item:nth-child(5){
        margin-right: -45px;
    }
    .custom-labels .rangeslider-horizontal .rangeslider__handle-label {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate3d(-50%,-50%,0);
        transform: translate3d(-50%,-50%,0);
    }
    .custom-labels .rangeslider-horizontal .rangeslider__handle:after {
        position: static;
    }
    .sav_chang .btn-danger {
        background: var(--theme-color)!important;
        border-radius: 32px;
        border: 1px solid var(--theme-color)!important;
        color:  var(--subtheme-color)!important;
        font-weight: 800;
    }
    .sav_chang .btn-danger:focus{
        box-shadow: 0 0 0 0.2rem var(--theme-color-hvr) !important;
    }
    /* .ReactModal__Content.ReactModal__Content--after-open{
        max-width: 800px;
    } */
    @media (min-width: 992px){
        &{
            max-width: 800px !important;          
        }
    }
    @media (max-width: 991px){
        &{
            max-width: 800px !important;
            left: 0!important;
            right: 0!important;
            top: 0!important;
            bottom: 0!important;
            border-radius: 0!important;
            margin-right: 0!important;
            -webkit-transform: none!important;
            transform: none!important;
            width: 100%!important;
            height: 100%!important;
        }
        .nn_rangeslider .rangeslider__labels .rangeslider__label-item:nth-child(1){
            margin-right: -50px;
        }
    }
`;
// 406856446609936

// 50px 13px 35px 13px
"use client";
import React from 'react'
import Home from "@/components/home/home";
import ModSelector from '../editor/modSelector';
import Service from '../common/services';
import AuthService from '../common/auth';
import User from '../user/userMain';
import Nav from '../nav/headerNav';
import Profile from '../editor/profile';
import RegSignIn from '../nav/regSignin';
import NavArrow from '../nav/arrow';
import AllMsgs from './allMsgs';
import Message from '../common/message';
import MetaBlog from '../editor/metaBlog';
import Features from './feature';
import ChartJS from '../chart/chartJS';
import Post from '../posts/post';
import Blogs from '../blogs/blogsInjection';

export default function Index() {
    const refCheck = React.useRef(null);
    React.useEffect(() => {
        if (typeof window !== "undefined" && refCheck.current) {
            const home = document.querySelector("section#home-index");
            const modSelector = new ModSelector();
            const service = new Service(modSelector);
            const blogs = new Blogs(modSelector, service);
            const user = new User(modSelector, service,);
            const auth = new AuthService(modSelector, service, user);
            const regSignin = new RegSignIn(modSelector, service, user);
            const feature = new Features();
            const nav = new Nav(modSelector, auth, service, user, regSignin);
            const message = new Message(modSelector, service, modSelector.blog)
            const allmsgs = new AllMsgs(modSelector, service, message);
            const _home = new Home(modSelector, service, nav, allmsgs, feature, blogs);
            _home.main(home as HTMLElement);
        }

    }, []);
    return (
        <div className="container-fluid mx-auto">
            <section ref={refCheck} id="home-index"></section>
        </div>
    )
}

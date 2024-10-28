import { Session } from "next-auth";
import { userType } from "../editor/Types";
import Header from "../editor/header";


class TestHeader {
    constructor(){
        
    }
    main(item:{parent:HTMLElement,session:Session|null}){
        const {parent,session}=item;
        Header.cleanUp(parent);
        const css="margin-inline:auto;display:flex;flex-direction:column;width:auto;justify-content:center;align-items:center;gap:1.5rem;width:100%;";
        parent.style.cssText=css;
        const para=document.createElement("p");
        para.style.cssText=css + "padding-inline:1rem;";
        const isUser=session ? session : {msg:"NO USER"};
        para.textContent="This is the Header" + ". User Type: " + JSON.stringify(isUser);
        parent.appendChild(para);

    }
};
export default TestHeader;
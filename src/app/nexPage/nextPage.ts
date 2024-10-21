

class NextPage{
    constructor(){

    }
    main(item:{parent:HTMLElement}){
        const {parent}=item;
        parent.style.position="relative";
        const container=document.createElement("div");
        container.style.cssText="margin-inline:auto;margin-block:6rem;display:flex;justify-content:center;align-items:center; gap:2rem";
        const para=document.createElement("p");
        para.style.cssText="margin-inline:auto;padding-inline:1rem;";
        para.textContent="This is a paragragh here to see if this is shown, given a single page load. If this fails then we need a back end. test more";
        container.appendChild(para);
        parent.appendChild(container);
    }
}
export default NextPage;
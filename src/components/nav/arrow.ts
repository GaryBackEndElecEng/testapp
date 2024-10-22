
import { FaAccessibleIcon, FaBlog,FaInfo,FaEdit,FaHome,FaMedapps,FaSign,FaFilePowerpoint,FaFacebookF,FaInstagramSquare,FaGithub,FaLinkedin,FaSitemap,FaMailBulk } from "react-icons/fa";
import { navLinkBtnType, userType, blogType, messageType, } from "../editor/Types";
import { FaArrowRight } from 'react-icons/fa';
import { FaBtn, FaCreate } from "../common/ReactIcons";
import * as Icons from "react-icons/fa";
import Header from '../editor/header';
import RegSignIn from './regSignin';
import Service from '../common/services';
import User from '../user/userMain';
import ModSelector from '../editor/modSelector';
import Misc from '../common/misc';
import Nav from './headerNav';
import MainHeader from './mainHeader';
import Profile from '../editor/profile';
import Features from '../home/feature';

class NavArrow{
    logo:string;
    checkUser:boolean;
    _isAdmin:boolean=false;
    btnArray:navLinkBtnType[];
    constructor(private _user:User,private _regSignin:RegSignIn,private _service:Service,private _profile:Profile,private _modSelector:ModSelector,public feature:Features){
        this.logo="/images/gb_logo.png";
        this._isAdmin=this._user.user.admin ? this._user.user.admin:false;
        this.checkUser=false;
        this.btnArray=[];
    }
   
        rotateArrow(item:{button:HTMLElement,time:number}){
        const {button,time}=item;
        const heightWidth=36;
        button.style.cssText=`position:relative;display:flex;justify:content:center;align-items:center;border-radius:50%;padding:5px;background-color:transparent;box-shadow:1px 1px 12px 1px white;color:white;transform:rotate(180deg);width:${heightWidth}px;height:${heightWidth}px;padding:1px;margin-block:auto;`
        button.style.color="white";
        button.id="rotateArrow-btn";
        FaCreate({parent:button,name:FaArrowRight,cssStyle:{width:"100%"}});
        button.onclick=(e:MouseEvent)=>{
            if(e){
                const getNavHeader=button.parentElement as HTMLElement;
                if(!getNavHeader) return;
                if(button.style.transform==="" || button.style.transform==="rotate(180deg)"){
                    this.imageAfterEffect({button,heightWidth,time:600,show:true})
                    button.style.transform="rotate(0deg)";
                    button.style.color="black";
                    button.style.backgroundColor="white";
                    this.slideMenu({navHeader:getNavHeader,show:true,time:600});
                    button.animate([
                        { transform: "rotate(180deg)",color:"white",backgroundColor:"transparent" },
                        { transform: "rotate(0deg)",color:"black",backgroundColor:"white" },
                    ], { duration: time, iterations: 1 });
                }else{
                    button.style.transform="rotate(180deg)";
                    button.style.color="white";
                    button.style.backgroundColor="transparent";
                    this.slideMenu({navHeader:getNavHeader,show:false,time:600});
                    this.slideMenu({navHeader:getNavHeader,show:false,time:600});
                    button.animate([
                        { transform: "rotate(0deg)",color:"black",backgroundColor:"white" },
                        { transform: "rotate(180deg)",color:"white",backgroundColor:"transparent" },
                    ], { duration: time, iterations: 1 });
                }
            }
        };
        
    }
    slideMenu(item:{navHeader:HTMLElement,show:boolean,time:number}){
        const {navHeader,show,time}=item;
        this.checkUser=(this._user.user && this._user.user.id && this._user.user.email) ? true :false;
        const header_height=window.innerWidth < 420 ? 195 :150;
        const headerHeight=this.checkUser ? header_height + 67 : header_height;
        Header.cleanUpByID(navHeader,"slide-menu");
        const popup=document.createElement("div");
        popup.id="slide-menu";
        popup.style.cssText="margin-block:auto;position:absolute;padding-inline:1rem;border-radius:8px;box-shadow:1px 1px 12px 1px rgba(12, 175, 255,0.5);background-color:#0C090A;top:65px;color:white;font-size:16px;width:350px;height:800px;z-index:400;border-radius:12px;box-shadow:1px 1px 12px 1px black;align-items:center;flex-direction:column;padding-block:1rem;";
        popup.style.width="400px";
        popup.style.minHeight="800px";
        popup.style.height="auto";
        popup.style.transform="translateX(-100%)";
        this.header({parent:popup,show,time,headerHeight,checkUser:this.checkUser});
        this.listItems({parent:popup,headerHeight})
        navHeader.appendChild(popup);
        if(show){
            popup.style.display="flex";
            popup.style.transform="translateX(0%)";
            popup.style.opacity="1";
            popup.animate([
                {transform:"translateX(-100%)",opacity:"0"},
                {transform:"translateX(0%)",opacity:"1"},
            ],{duration:time,iterations:1,easing:"ease-in-out"});
        }else{
            
            popup.style.transform="translateX(-100%)";
            popup.style.opacity="0";
            popup.animate([
                {transform:"translateX(0%)",opacity:"1"},
                {transform:"translateX(-100%)",opacity:"0"},
            ],{duration:time,iterations:1,easing:"ease-in-out"});
            setTimeout(()=>{popup.style.display="none";},time-20);
        }
    }
    header(item:{parent:HTMLElement,show:boolean,time:number,headerHeight:number,checkUser:boolean}){
        const {parent,show,time,headerHeight,checkUser}=item;
        // Header.cleanUpByID(parent,"header-logo");
        const container=document.createElement("div");
        container.id="header-logo";
        container.style.cssText=`width:100%;height:${headerHeight}px;padding:10px;border-radius:12px;margin-inline:auto;display:flex;place-items:center;background-color:white;color:black;position:absolute;top:0%;left:0%;box-shadow:1px 1px 6px 1px white;`;
        const para=document.createElement("p");
        para.id="para-header";
        const img=document.createElement("img");
        img.src=this.logo;
        img.alt="www.ablogroom.com";
        img.style.cssText="width:125px;height:125px;aspect-ratio:1 / 1;border-radius:50%;shape-outside:circle(50%);float:left;margin-right:7px;filter:drop-shadow(0 0 0.7rem blue);background-color:black;";
        para.appendChild(img);
        para.style.cssText="font-family:Poppins-Regular;font-size:16px;line-height:2.5rem;";
        if(checkUser){
            para.innerHTML+="<span style='color:blue;font-size:110%;'>signed in</span>. please check your <span style='color:blue;font-size:110%;'>profile</span>, below to manage your blogs,,,over <span style='color:blue;font-weight:bold'> 30 management features</span> for you to use.";
        }else{
            para.innerHTML+="yours to use, we strive to suit your needs. <br/><span>www.ablogroom.com</span>";
        }
        container.appendChild(para);
        this.headerImageEffect({img,show,time});
        if(show){
            container.style.transform="translateX(0%)";
            container.style.opacity="1";
            parent.appendChild(container);
            container.animate([
                {transform:"translateX(-100%)",opacity:"0",boxShadow:""},
                {transform:"translateX(0%)",opacity:"1",boxShadow:"1px 1px 6px 1px white"},
            ],{duration:time+50,iterations:1,easing:"ease-in-out"});
        }else{
            container.style.transform="translateX(-100%)";
            container.style.opacity="0";
            container.animate([
                {transform:"translateX(0%)",opacity:"1",boxShadow:"1px 1px 6px 1px white"},
                {transform:"translateX(-100%)",opacity:"0",boxShadow:""},
            ],{duration:time-50,iterations:1,easing:"ease-in-out"});
            // setTimeout(()=>{parent.removeChild(container)},time-30);
        }
        

    }
    headerImageEffect(item:{img:HTMLImageElement,show:boolean,time:number}){
        const {img,show,time}=item;
        if(show){
            img.style.opacity="1";
            img.style.transform="scale(1)";
            img.animate([
                {backdropFilter:"blur(20px)",opacity:"0.3"},
                {backdropFilter:"blur(0px)",opacity:"1"},
            ],{duration:time + 475,iterations:1,easing:"ease-in-out"});
        }else{
            img.style.opacity="0.3";
            img.style.transform="scale(0.5)";
            img.animate([
                {transform:"scale(1)",opacity:"1"},
                {transform:"scale(0.5)",opacity:"0.3"},
            ],{duration:time -200,iterations:1,easing:"ease-in-out"});
        }
    }
    imageAfterEffect(item:{button:HTMLElement,heightWidth:number,time:number,show:boolean}){
        const {button,heightWidth,time,show}=item;
        button.style.position="relative";
        Header.cleanUpByID(button,"imgAfterEffect");
        const img=document.createElement("img");
        img.id="imgAfterEffect";
        img.src=this.logo;
        img.alt="www.ablogroom.com";
        img.style.cssText=`width:${heightWidth}px;height:${heightWidth}px;box-shadow:1px 1px 12px 1px white;align-self:center;border-radius:50%;margin-block:auto;position:absolute;`;
        img.style.display="none";
        button.appendChild(img);
        if(show){
            setTimeout(()=>{
                img.style.display="block";
                img.style.transform="translateX(110%)";
                img.animate([
                    {opacity:"0",boxShadow:"",transform:"translateX(-100%)"},
                    {opacity:"1",boxShadow:"1px 1px 12px 1px white",transform:"translateX(110%)"}
                ],{duration:time,iterations:1});
            },time);
        }else{
            img.style.boxShadow="";
            img.style.opacity="0";
            img.style.transform="translateX(-100%)";
            img.animate([
                {opacity:"1",boxShadow:"1px 1px 12px 1px white",transform:"translateX(0%)"},
                {opacity:"0",boxShadow:"",transform:"translateX(-100%)"},
            ],{duration:time -100,iterations:1});
            setTimeout(()=>{button.removeChild(img)},time-120);
        }
    }
    listItems(item:{parent:HTMLElement,headerHeight:number}){
        const {parent,headerHeight}=item;
        if( typeof window !=="undefined"){
            this.checkUser=(this._user.user && this._user.user.id && this._user.user.email) ? true:false;
            this._isAdmin=(this.checkUser && this._user.user.admin) ? true:false;
            MainHeader.header=document.querySelector("header#navHeader") as HTMLElement;
            if(!MainHeader.header) return;
            // Header.cleanUpByID(MainHeader.header,"list-items-container");
            this.btnArray=[
                {id:0,name:"home",color:"pink",link:"/",func:()=>Nav.navHistory("/"),icon:FaHome,show:true,isEditor:false,save:async()=>null},
                {id:1,name:"blogs",color:"#00BFFF",link:"/blogs",func:()=>Nav.navHistory("/blogs"),icon:FaBlog,show:true,isEditor:false,save:async()=>null},
                {id:2,name:"admin",color:"red",link:"/admin",func:()=> Nav.navHistory("/admin"),icon:FaSign,show:this._isAdmin,isEditor:false,save:async()=>null},
                {id:3,name:"editor",color:"#00BFFF",link:"/editor",func:()=>Nav.navHistory("/editor"),icon:FaEdit,show:true,isEditor:true,save:()=>null},
                {id:4,name:"posts",color:"#00BFFF",link:"/posts",func:()=>Nav.navHistory("/posts"),icon:Icons.FaDropbox,show:true,isEditor:true,save:()=>null},
                {id:5,name:"chart",color:"#00BFFF",link:"/chart",func:()=>Nav.navHistory("/chart"),icon:Icons.FaChartBar,show:true,isEditor:true,save:()=>null},
                {id:6,name:"signin",color:"#00FF00",link:null,func:()=> this._regSignin.signIn(),icon:FaSign,show:!this.checkUser,isEditor:false,save:()=>null},
                {id:7,name:"logout",color:"#00FF00",link:null,func:()=> this.logout(),icon:FaSign,show:this.checkUser,isEditor:false,save:()=>null},
                {id:8,name:"contact",color:"#00FF00",link:null,func:()=> this.contact(MainHeader.header as HTMLElement),icon:FaMedapps,show:true,isEditor:false,save:()=>null},
                {id:9,name:"profile",color:"#800000",link:null,func:()=> this._profile.main(MainHeader.header as HTMLElement),icon:FaAccessibleIcon,show:this.checkUser,isEditor:false,save:()=>null},
                {id:10,name:"general-Info",color:"#00FF00",link:null,func:()=> this.generalInfo(MainHeader.header as HTMLElement),icon:FaInfo,show:true,isEditor:false,save:()=>null},
                {id:11,name:"features",color:"#00FF00",link:null,func:()=> this.feature.feature(document.body as HTMLElement),icon:FaFilePowerpoint,show:true,isEditor:false,save:()=>null},
            ]
        }
        ////----------!!IS CLIENT LOGGED IN ? YES=> SHOW ELSE: HIDE -----//////
        const user=this._user.user;
        this.checkUser= (user && user.id) ? true : false;
        ////----------!!IS CLIENT LOGGED IN ? YES=> SHOW ELSE: HIDE -----//////
        const container=document.createElement("div");
        container.id="list-items-container";
        container.style.cssText=`margin:auto;margin-top:${headerHeight + 16}px;display:flex;flex-direction:column;justify-content:center;align-items:center; gap:1rem;width:100%;padding-inline:2rem;`;
        parent.appendChild(container);
        this.btnArray.map(navItem=>{
            if(navItem && navItem.show){
                this.navItem({parent:container,navItem:navItem});
                const hr=document.createElement("hr");
                hr.style.cssText="width:100%;margin-bottom:0.5rem;background:white;";
                container.appendChild(hr);
            }
        });
    }
    navItem(item:{parent:HTMLElement,navItem:navLinkBtnType}){
        const {parent,navItem}=item;
        const url=new URL(window.location.href);
        const pathname=url.pathname;
        const name_css="color:white;";
        const iDiv=document.createElement("div");
        iDiv.className="list-icon";
        iDiv.style.cssText="border-radius:50%;display:flex;justify-content:center;align-items:center;width:26px;height:26px;aspect-ratio:1 / 1;";
        FaBtn({parent:iDiv,icon:navItem.icon,cssStyle:{background:"inherit",width:"100%"}});
        const li=document.createElement("li");
        li.style.cssText="position:relative;"
        li.id="list-nav-item";
        li.textContent=`${navItem.name.toUpperCase()}`;
        li.style.cssText="list-style:none;";
        const itemCont=document.createElement("div");
        itemCont.id=`item-container-${navItem.name}`;
        itemCont.style.cssText="display:flex;justify-content:space-around;align-items:center;width:100%;flex-wrap:nowrap;cursor:pointer;";
        // itemCont.className="nav-item-element";
        itemCont.appendChild(iDiv);
        itemCont.appendChild(li);
        parent.appendChild(itemCont);
        itemCont.onmouseover=(e:Event)=>{
            if(e){
                itemCont.style.color=navItem.color;
                itemCont.style.transform="translateX(5%)";
                itemCont.animate([
                    {color:"white",transform:"translateX(0%)"},
                    {color:navItem.color,transform:"translateX(5%)"},
                ],{duration:700,iterations:1,"easing":"ease-in-out"});
            }
        };
        itemCont.onmouseout=(e:Event)=>{
            if(e){
                itemCont.style.color="white";
                itemCont.style.transform="translateX(0%)";
                itemCont.animate([
                    {color:navItem.color,transform:"translateX(5%)"},
                    {color:"white",transform:"translateX(0%)"},
                ],{duration:700,iterations:1,"easing":"ease-in-out"});
            }
        };
        itemCont.setAttribute("data-color",navItem.color);
        itemCont.onclick=async(e:MouseEvent)=>{
            if(e){
                if(navItem.link){
                    const newUrl=new URL(navItem.link,url.origin);
                    window.location.href=newUrl.href;
                }else{
                    const getArrowButton=document.querySelector("button#rotateArrow-btn") as HTMLButtonElement;
                    if(!getArrowButton) return;
                    getArrowButton.click();
                    if(navItem.name==="logout"){
                        if(pathname==="/editor"){
                            
                                await this.navigateSaveBlog({parent:MainHeader.header as HTMLElement,link:"/"})
                            
                        }else{

                           await this.logout()
                        }

                    }else{
                        navItem.func(); //executing nav functions
                    }
                }
                navItem.save(); // executing save function if exists
            }
        };
        Misc.growIn({anchor:li,scale:0,opacity:0,time:900});

    }
    async navigateSaveBlog(item:{parent:HTMLElement,link:string}){
        const {parent}=item;
        const user=this._user.user;
        this.promGetBlog().then(async(res)=>{
            if(res){
               const blog= res.blog()
               if(blog){
                   const shift=window.innerWidth <500 ? "15%":"25%";
                   parent.style.position="relative";
                   parent.style.zIndex="";
                   if(parent  && typeof window !=="undefined"){
                       // console.log("action",action);
                      
                        let blog_={...blog,user_id:user.id};
                        const btnGrp=document.createElement("div");
                        btnGrp.id="navigateSaveBtnGrp";
                        btnGrp.style.cssText="position:absolute;width:300px;min-height:100px;background-color:#0a2351;border-radius:10px;box-shadow:1px 1px 10px 1px black;display:flex;flex-direction:row;justify-content:space-around;align-items:center;z-index:100;"
                        btnGrp.style.inset=`10% ${shift} 90% ${shift}`;
                        const {button:save}=Misc.simpleButton({anchor:btnGrp,text:"save",color:"white",bg:Nav.btnColor,type:"button",time:400});
                        const {button:cancel}=Misc.simpleButton({anchor:btnGrp,text:"not now",color:"white",bg:Nav.btnColor,type:"button",time:400});
                        //APPENDING btnGrp TO PARENT
                        parent.appendChild(btnGrp);
                        Misc.fadeIn({anchor:btnGrp,xpos:100,ypos:50,time:400});
                        save.addEventListener("click",async(e:MouseEvent)=>{
                            if(e){
                                if( user && user.id){
                                    if(blog_.name){
        
                                        //SAVE WORK HERE
                                        this._service.saveBlog(blog_).then(async(blog)=>{
                                            if(blog){
                                                this._modSelector._blog=blog;
                                                Misc.message({parent,msg:"saved",type_:"success",time:400});
                                                setTimeout(()=>{
                                                    const navigateSaveBtnGrp=parent.querySelector("div#navigateSaveBtnGrp") as HTMLElement;
                                                    Misc.fadeOut({anchor:navigateSaveBtnGrp,xpos:50,ypos:100,time:400});
                                                    setTimeout(async()=>{
                                                       await this.logout()
                                                       parent.removeChild(navigateSaveBtnGrp);
                                                    },380);
                                                },380);
                                            }
                                        });
                                    }else{
                                        blog_={...blog_,name:"newBlog",desc:"enter description",title:"Your Title"};
                                        this._service.newBlog(blog_).then(async(newBlog)=>{
                                            if(newBlog && typeof(newBlog)!=="string"){
                                                blog_={...blog_,id:newBlog.id};
                                                //SAVE WORK HERE
                                                this._service.saveBlog(blog_).then(async(blog)=>{
                                                    if(blog){
        
                                                        Misc.message({parent,msg:"saved",type_:"success",time:400});
                                                        setTimeout(()=>{
                                                            const navigateSaveBtnGrp=parent.querySelector("div#navigateSaveBtnGrp") as HTMLElement;
                                                            Misc.fadeOut({anchor:navigateSaveBtnGrp,xpos:50,ypos:100,time:400});
                                                            setTimeout(async()=>{
                                                               await this.logout();
                                                                parent.removeChild(navigateSaveBtnGrp);
                                                            },380);
                                                        },380);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }else{
                                    this._regSignin.signIn();
                                }
                                
                            }
                        });
                        cancel.addEventListener("click",(e:MouseEvent)=>{
                            if(e){
                                Misc.fadeOut({anchor:btnGrp,xpos:50,ypos:100,time:400});
                                setTimeout(async()=>{
                                    parent.removeChild(btnGrp);
                                   await this.logout()
                                },380);
                            }
                        });
                       
           
                   }
               }else{
                Misc.message({parent,msg:"could not find your blog to save",type_:"error",time:800});
               }
            }else{
                await this.logout();
            }
        });
    }
    contact(parent:HTMLElement){
        Nav.navHeader=document.querySelector("header#navHeader") as HTMLElement;
        const useParent= parent ? parent :Nav.navHeader;
        useParent.style.zIndex="";
        const cont=document.createElement("div");
        useParent.style.position="relative";
        cont.id="contact";
        cont.style.cssText=`position:absolute;width:fit-content;padding:1rem;background:rgb(3 13 49);color:white;inset:270% 0% 0% 0%;height:fit-content;margin-inline:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:16px;box-shadow:1px 1px 6px 1px aquamarine;padding:1rem;z-index:200;`;
        cont.style.inset="270% 37% 10% 37%";
        const form=document.createElement("form");
        form.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;padding:1.5rem;border-radius:inherit;background:white;color:black;margin:1rem;color:white;box-shadow:1px 1px 12px 1px skyblue;";
        const divGrp=document.createElement("div");
        divGrp.id="contact-welcom-message";
        divGrp.style.cssText="margin-inline:auto;position:relative;display:flex;flex-direction:column;margin-bottom:2rem;padding-inline:2rem;";
        const img=document.createElement("img");
        const imgWidth=170;
        img.src=Misc.sourceImage({src:"gb_logo.png",width:imgWidth,quality:75});
        img.alt="www.ablogroom.com";
        img.style.cssText="border-radius:50%;filter:drop-shadow(0 0 0.5rem white);shape-outside:circle(50%);float:right;margin-right:1.5rem;margin-bottom:0px;box-shadow:1px 1px 12px 1px;";
        img.style.width=`${imgWidth}px`;
        const text=document.createElement("p");
        text.id="contact-text-title"
        text.className="text-primary";
        text.style.cssText="font-family:'Playwrite';font-size:130%;line-height:2.75rem;";
        text.appendChild(img);
        text.innerHTML+="send us a thought. We keep your information private secret. Alternatively, you can uncheck the box, below; title:<span style='color:white'>'secret'</span>";
        divGrp.appendChild(text);
        const formGrp=document.createElement("div");
        const formGrp1=document.createElement("div");
        const formGrp2=document.createElement("div");
        const formGrp3=document.createElement("div");
        formGrp.className="form-group";
        formGrp.style.cssText="margin-inline:auto;text-align:center;position:relative;";
        formGrp1.className="form-group";
        formGrp1.style.cssText="margin-inline:auto;text-align:center;position:relative;";
        formGrp2.className="form-group";
        formGrp2.style.cssText="margin-inline:auto;text-align:center;position:relative;";
        formGrp3.className="form-group";
        formGrp3.style.cssText="margin-inline:auto;text-align:center;position:relative;";
        const labelName=document.createElement("label");
        labelName.className="text-primary text-center";
        labelName.textContent="name";
        formGrp2.appendChild(labelName);
        const name=document.createElement("input");
        name.name="name";
        name.className="form-control";
        name.type="text";
        formGrp2.appendChild(name);
        const label=document.createElement("label");
        label.className="text-primary text-center";
        label.textContent="email";
        formGrp.appendChild(label);
        const email=document.createElement("input");
        email.name="email";
        email.className="form-control";
        email.pattern="[a-zA-Z0-9\.]{2,}@[a-zA-Z0-9]{2,}\.[a-z]{2,3}";
        email.type="text";
        formGrp.appendChild(email);
        formGrp.className="form-group";
        const labelMsg=document.createElement("label");
        labelMsg.className="text-primary text-center";
        labelMsg.textContent="Request";
        formGrp1.appendChild(labelMsg);
        const msg=document.createElement("textarea");
        msg.name="msg";
        msg.className="form-control";
        msg.style.cssText="min-width:300px;";
        msg.rows=4;
        ///
        const labelRate=document.createElement("label");
        labelRate.className="text-primary text-center";
        labelRate.textContent="rate us";
        formGrp3.appendChild(labelRate);
        const rate=document.createElement("input");
        rate.name="rate";
        rate.className="form-control";
        rate.type="number";
        rate.min="1";
        rate.max="5";
        formGrp3.appendChild(rate);
        const btn=document.createElement("button");
        btn.className="btn btn-sm btn-primary";
        btn.style.cssText="padding-inline:2rem; padding-block:0.5rem;border-radius:20px;margin-block:2rem;";
        btn.type="submit";
        btn.disabled=true;
        btn.textContent="send";
        const rateSecret=document.createElement("div");
        rateSecret.style.cssText="margin:auto;display:flex;justify-content:center;align-items:center;gap:1.5rem;";
        rateSecret.appendChild(formGrp3);
        rateSecret.appendChild(formGrp3);

        ///
        const {input:secret,label:seclabel,formGrp:fGrp}=Nav.inputComponent(rateSecret);
        secret.type="checkbox";
        secret.id="secret-checkbox";
        secret.name="secret";
        seclabel.setAttribute("for",secret.id);
        fGrp.className="";
        secret.className="";
        seclabel.textContent="secret";
        secret.checked=false;
        secret.style.width="30px";
        formGrp1.appendChild(msg);
        form.appendChild(formGrp2);
        form.appendChild(formGrp);
        form.appendChild(formGrp1);
        form.appendChild(rateSecret);
        ///
        form.appendChild(btn);
        cont.appendChild(divGrp);
        cont.appendChild(form);
        Nav.cancel(parent,cont);
        useParent.appendChild(cont);
        if(btn.disabled){
            btn.style.color="white";
            btn.style.backdropFilter="";
            btn.animate([
                {backdropFilter:"blur(20px)"},
                {backdropFilter:"blur(0px)"},
            ],{duration:1200,iterations:1});
        }else{
            btn.style.color="transparent";
            btn.style.backdropFilter="blur(10px)";
        }
        Misc.matchMedia({parent:cont,maxWidth:1400,cssStyle:{inset:"270% 29% 10% 29%"}});
        Misc.matchMedia({parent:cont,maxWidth:1200,cssStyle:{inset:"270% 25% 10% 25%"}});
        Misc.matchMedia({parent:cont,maxWidth:900,cssStyle:{inset:"270% 18% 10% 18%"}});
        Misc.matchMedia({parent:cont,maxWidth:400,cssStyle:{inset:"270% 0% 10% 0%"}});
       cont.animate([
        {transform:"translateY(-100%)",opacity:0},
        {transform:"translateY(0%)",opacity:1},
       ],{duration:300,iterations:1});
       const msg_e=document.createElement("p");
       msg_e.style.cssText="position:absolute;font-weight:bold;font-size:12px;";
       msg_e.className="text-primary"
       msg_e.style.inset="100% 0% -40% 0%";
       formGrp.appendChild(msg_e);
       name.addEventListener("change",(e:Event)=>{
        if(e){
            const nm=(e.currentTarget as HTMLInputElement).value;
            const msg_=(msg as HTMLTextAreaElement).value;
            const email_=(email as HTMLInputElement).value;
            const checks=[nm,msg_,email_].map(ch=>((ch.split("").length>0)));
            if(checks.includes(true)){
                btn.disabled=false;
            }
        }
       });
       msg.addEventListener("change",(e:Event)=>{
        if(e){
            const nm=(e.currentTarget as HTMLTextAreaElement).value;
            const msg_=(name as HTMLInputElement).value;
            const email_=(email as HTMLInputElement).value;
            const checks=[nm,msg_,email_].map(ch=>((ch.split("").length>0)));
            if(checks.includes(true)){
                btn.disabled=false;
            }
        }
       });
       email.addEventListener("input",(e:Event)=>{
        if(e){
            const reg:RegExp=/[a-zA-Z0-9\.]{2,}@[a-zA-Z0-9]{2,}\.[a-z]{2,3}/g;
            const mail=(e.currentTarget as HTMLInputElement).value;
            
            if(reg.test(mail)){
                msg_e.textContent="Thanks"
            }else{
                msg_e.textContent=" in a form of myEmail@mail.com";
            }
        }
       });
       form.addEventListener("submit",async(e:SubmitEvent) =>{
        if(e){
            e.preventDefault();
            const value=(email as HTMLInputElement).value;
            const testEmail=Nav.regTest({item:"email",value});
            if(testEmail.item==="pass"){
                btn.disabled=false;
                const formdata=new FormData(e.currentTarget as HTMLFormElement);
                const email:string | null=formdata.get("email") as string;
                const name:string | null=formdata.get("name") as string;
                const msg:string | null=formdata.get("msg") as string;
                const rate:string | null=formdata.get("rate") as string;
                const secret:string | null=formdata.get("secret") as string;
                if(email && name && msg){
                    const user_id=this._user.user.id ? this._user.user.id : undefined;
                    const Msg:messageType={name,email,msg,user_id,rate:parseInt(rate),secret:Boolean(secret),sent:false};
                    await this._service.sendMsgToServer(useParent,Msg).then(async(res)=>{
                        if(res){
                            Misc.fadeOut({anchor:cont,xpos:75,ypos:100,time:400});
                            setTimeout(()=>{useParent.removeChild(cont);},380);
                            Nav.thankMsg(useParent,"signIn",Nav.thanksMsg);
                        }
                    });
                  
                }else{
                    Misc.messageHeader({parent:useParent,msg:"email, name and message should be filled",type_:"error",time:700});
                }
            }
        }
       });
    }
    async logout(): Promise<void>{
        MainHeader.header=document.querySelector("header#navHeader") as HTMLElement;
        this._user.user={} as userType;
        localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        localStorage.removeItem("email");
        setTimeout(()=>{
            localStorage.removeItem("user");
        localStorage.removeItem("user_id");
        localStorage.removeItem("email");
        },1000);
        console.log(this._user.user)
        const user=this._user.user;
        this._user._user={...user,id:"",email:"",blogs:[] as blogType[],name:undefined,bio:undefined,admin:false,showinfo:false} as userType;
        this._user.user=this._user._user;
        this.checkUser=false;
        window.scroll(0,0);
        return this._service.signout();
    }
   
    generalInfo(parent:HTMLElement){
        const container=document.createElement("div");
        container.style.cssText="margin-inline:auto;position:absolute;max-width:600px;width:100%;top:160%;left:35%;";
        Misc.matchMedia({parent:container,maxWidth:600,cssStyle:{"top":"160%","left":"0%","right":"0%"}});
        this._service.peronalInfo().then(async(res)=>{
                if(res){
                    parent.style.position="relative";
                    parent.style.zIndex="";
                    const container=document.createElement("div");
                    container.id="bio-container";
                    container.style.cssText="width:100%; max-width:400px;box-shadow:1px 1px 10px black;border-radius:16px;position:absolute;box-shadow:1px 1px 10px 1px black;border-radius:16px;z-index:100;display:grid;place-items:center;";
                    container.style.top="160%";
                    container.style.left="34%";
                    container.style.right="34%";
                    Misc.matchMedia({parent:container,maxWidth:600,cssStyle:{"top":"160%","left":"0%","right":"0%"}});
                    const card=document.createElement("div");
                    card.className="card";
                    card.style.cssText="width:100%;border-radius:inherit;background-color:#0C090A;max-width:350px;margin-inline:auto;border-radius:inherit;position:relative;display:flex;justify-content:center;align-items:center;flex-direction:column;box-shadow:1px 1px 10px 1px black;";
                    const img=document.createElement("img");
                    img.style.cssText="border-radius:50%;box-shadow:1px 1px 10px 1px white;padding:0.5rem;margin-block:0.5rem;margin-inline:auto;width:100%;max-width:320px;"
                    img.classList.add("card-img-top");
                    img.src="/images/gb_logo.png";
                    img.alt="Gary Wallace";
                    card.appendChild(img);
                    const cardBody=document.createElement("div");
                    cardBody.style.cssText="margin-inline:auto;padding-inline:1rem;display:flex;justify-content:center;flex-direction:column;align-items:center;background-color:white;border-radius:0% 0% 16px 16px;";
                    const H5=document.createElement("h6");
                    H5.className=" text-primary";
                    H5.style.cssText="font-size:1.5rem;"
                    H5.textContent="Info";
                    H5.classList.add("card-title");
                    cardBody.appendChild(H5);
                    const name=document.createElement("h6");
                    name.className="text-primary display-6";
                    name.textContent=res.name;
                    cardBody.appendChild(name);
                    //address
                    const address=document.createElement("div");
                    address.className="";
                    address.style.cssText="margin-inline:1rem;padding-inline:0.5rem;width:100%;";
                    const addColL=document.createElement("div");
                    //left col
                    addColL.classList.add("UL-info");
                    const addUlL=document.createElement("ul");
                    addUlL.style.cssText="width:100%;margin:auto;text-wrap:nowrap;";
                    const liL1=document.createElement("li");
                    liL1.textContent=`${res.city},${res.provState}, ${res.country}`;
                    addUlL.appendChild(liL1);
                    const liL2=document.createElement("li");
                    liL2.textContent=`PO:${res.postal}`;
                    addUlL.appendChild(liL2);
                    const liL3=document.createElement("li");
                    liL3.textContent=res.city;
                    addUlL.appendChild(liL3);
                    const liL4=document.createElement("li");
                    liL4.textContent=res.extra;
                    addUlL.appendChild(liL4);
                    const liL5=document.createElement("li");
                    liL5.textContent=res.cell;
                    addUlL.appendChild(liL5);
                    addColL.appendChild(addUlL);
                    address.appendChild(addColL);
                    //appending address (row)
                    cardBody.appendChild(address);
                    this.siteArray(cardBody,res.siteArray);
                    //address
                    const btnGrp=document.createElement("div");
                    btnGrp.style.cssText="padding-inline:1rem;margin-inline:auto;display:flex;flex-direction:row;justify-content:center;aligns-item:center;margin-block:1rem;";
                    const {button:close}=Misc.simpleButton({anchor:btnGrp,text:"close",bg:"black",color:"white",type:"button",time:400});
                    cardBody.appendChild(btnGrp);
                    card.appendChild(cardBody);
                    container.appendChild(card);
                    parent.appendChild(container);
                    Misc.fadeIn({anchor:container,xpos:20,ypos:100,time:700});
                    Misc.matchMedia({parent:container,maxWidth:900,cssStyle:{top:"160%",left:"23%",right:"23%"}});
                    Misc.matchMedia({parent:container,maxWidth:400,cssStyle:{top:"160%",left:"1%",right:"1%"}});
                    close.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            Misc.fadeOut({anchor:container,xpos:20,ypos:100,time:600});
                            setTimeout(()=>{
                                parent.removeChild(container);
                            },580);
                        }
                    });
                }
        });
    }

    siteArray(parent:HTMLElement,array:string[]){
        const container=document.createElement("div");
        container.id="sites";
        const row=document.createElement("div");
        row.style.cssText="display:flex;justify-content:center;align-items:center;flex-direction:row;flex-wrap:wrap;"
        array.map((item,index)=>{
            if(item){
                const parse=item.split("::") as string[]
                const parseAgain={key:parse[0],link:parse[1]}
                const {key,link}=parseAgain as {key:string,link:string};
                if(key==="fb"){
                    
                    const iconDiv=document.createElement("div");
                    iconDiv.id="fa";
                    iconDiv.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv,name:FaFacebookF,cssStyle:{color:"blue"}});
                    row.appendChild(iconDiv);
                    iconDiv.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            window.open(link,"_blank");
                        }
                    });
                }else if(key==="linkedin"){
                    
                    const iconDiv1=document.createElement("div");
                    iconDiv1.id="linkedln";
                    iconDiv1.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv1,name:FaLinkedin,cssStyle:{color:"blue"}});
                    row.appendChild(iconDiv1);
                    iconDiv1.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            window.open(link,"_blank");
                        }
                    });
                }else if(key==="github"){
                    
                    const iconDiv2=document.createElement("div");
                    iconDiv2.id="github";
                    iconDiv2.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv2,name:FaGithub,cssStyle:{color:"blue"}});
                    row.appendChild(iconDiv2);
                    iconDiv2.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            window.open(link,"_blank");
                        }
                    });
                }else if(key==="instagram"){
                    
                    const iconDiv3=document.createElement("div");
                    iconDiv3.id="instagram";
                    iconDiv3.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv3,name:FaInstagramSquare,cssStyle:{color:"blue"}});
                    row.appendChild(iconDiv3);
                    iconDiv3.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            window.open(link,"_blank");
                        }
                    });
                }else if(key !=="email"){
                    
                    const iconDiv4=document.createElement("div");
                    iconDiv4.id=`website-${index}`;
                    iconDiv4.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv4,name:FaSitemap,cssStyle:{color:"blue"}});
                    row.appendChild(iconDiv4);
                    iconDiv4.addEventListener("click",(e:MouseEvent)=>{
                        if(e){
                            window.open(link,"_blank");
                        }
                    });
                }else{
                    const anchor=document.createElement("a");
                    anchor.style.cssText="cursor:pointer;color:white;background-color:rgba(0,0,0,0.1);border-radius:6px;display:flex;justify-content:center;align-items:center;margin-block:1rem;"
                    const iconDiv4=document.createElement("div");
                    iconDiv4.id=`email-${index}`;
                    iconDiv4.style.cssText="border-radius:50%;width:37px;height:37px;position:relative;"
                    FaCreate({parent:iconDiv4,name:FaMailBulk,cssStyle:{color:"red",fontSize:"35px"}});
                    anchor.appendChild(iconDiv4);
                    container.appendChild(anchor);
                }
            }
        });
        container.appendChild(row);
        parent.appendChild(container);
    }
    promGetBlog(){
        
            return new Promise(resolve=>{
                resolve({
                    blog:()=>{
                        if(typeof window !=="undefined"){
                           const getBlogStr= localStorage.getItem("blog");
                            if(!getBlogStr) return null;
                            return JSON.parse(getBlogStr) as blogType
                        }else{
                            return null
                        }

                    }
                });
            }) as Promise<{blog:()=>blogType|null}>;
        
    }

}
export default NavArrow;
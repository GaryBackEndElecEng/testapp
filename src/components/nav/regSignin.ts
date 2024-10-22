import { FaCrosshairs } from "react-icons/fa";
import Misc from "../common/misc";
import { FaCreate } from "../common/ReactIcons";
import Service from "../common/services";
import Header from "../editor/header";
import ModSelector from "../editor/modSelector";
import { blogType, providerType, userType } from "../editor/Types";
import User from "../user/userMain";
import Nav from "./headerNav";
import { getCsrfToken,getProviders,LiteralUnion,signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { getErrorMessage } from "@/lib/errorBoundaries";


class RegSignIn {
    logo:string;
    count:number;
    pReg:RegExp=/[0-9a-zA-Z\.\?\#\!]{5,}/;
    eReg:RegExp=/[0-9a-zA-Z\.]{2,}\@[a-z]{2,}\.[a-z]{1,3}/;
    constructor(private _modSelector:ModSelector,private _service:Service,private _user:User,){
        this.pReg=/[0-9a-zA-Z\.\?\#\!]{5,}/;
        this.eReg=/[0-9a-zA-Z\.]{2,}\@[a-z]{2,}\.[a-z]{1,3}/;
        this.count=0;
        this.logo="gb_logo.png";
    }
    async signIn(){
        //parent=MainHeader.header
        const getmainHeader=document.querySelector("header#navHeader") as HTMLElement;
        if(!getmainHeader) return;
        getmainHeader.style.zIndex="";
        getmainHeader.style.position="relative";
        getmainHeader.style.justifyContent="space-between";
        Header.cleanUpByID(getmainHeader,"container-signin-signin-popup");
        const section=document.createElement("section");
        section.id="container-signin-signin-popup";
        section.style.cssText="margin:auto;position:absolute;background-color:#10c0b68f;filter:drop-shadow(0 0 0.75rem crimson);border-radius:7px;padding:1rem;;z-index:1000;display:flex;flex-direction:column;align-items:center;gap:2rem;padding:1.5rem;width:clamp(390px,550px,550pc);z-index:20";
        section.style.inset="150% 0% 0% 0%";
        getmainHeader.appendChild(section);
        Misc.growIn({anchor:section,scale:0,opacity:0,time:400});
        Misc.matchMedia({parent:section,maxWidth:900,cssStyle:{inset:"190% 10% 0% 10%"}});
        Misc.matchMedia({parent:section,maxWidth:400,cssStyle:{inset:"250% 2% 20% 2%"}});
        const url=window.location.pathname;
        const hasBlog=await this.hasStorage();
        if(hasBlog){
            const blog=this._modSelector.blog;
           await this._service.promsaveItems(blog).then(async(res)=>{
            if(res){
                Misc.message({parent:section,msg:"your items are temporarily saved",type_:"success",time:600});
            }
           });
        }
        const csrfToken= await getCsrfToken();
        const providers= await getProviders() as unknown as providerType[];
        this.signiMain(section,providers,csrfToken);
        this.removeItem({parent:getmainHeader,target:section})
        const {button}=Misc.simpleButton({anchor:section,bg:Nav.btnColor,color:"white",text:"register",time:400,type:"button"});
        button.id="signIn-main-register-btn";
        Misc.matchMedia({parent:section,maxWidth:900,cssStyle:{width:"100%",inset:"1100% 0% 0% 0%",position:"absolute",height:"100vh"}});
        Misc.matchMedia({parent:section,maxWidth:400,cssStyle:{width:"100%",inset:"1100% 0% 0% 0%",position:"absolute",height:"100vh"}});
        button.onclick=(e:MouseEvent)=>{
            if(e){
                getmainHeader.style.position="absolute";
                this.register(getmainHeader,section);
            }
         };
        //  Misc.matchMedia({parent:section,maxWidth:400,cssStyle:{width:"100%",height:"100vh"}})

    }
    hasStorage():Promise<boolean>{
        return new Promise(resolve=>{
            let isblog:boolean=false;
            if(localStorage.getItem("blog")){
                isblog=true;
            }
            resolve(isblog)
        }) as Promise<boolean>;
        

    }
    register(mainHeader:HTMLElement,section:HTMLElement){
        //ADD LOG AND ENSURE SECRETLEY
        //REMOVING SIGNIN AND BUILDING REGISTER
        Header.cleanUpByID(section,"signIn-main");
        Header.cleanUpByID(section,"signIn-main-register-btn");
        Header.cleanUpByID(section,"register-container");
        mainHeader.style.position="relative";
        const container=document.createElement("div");
        container.id="register-container";
        section.style.position="absolute";
        section.style.zIndex="200";
        section.style.zIndex="100% 0% 0% 0%";
        section.style.display="flex";
        section.style.flexDirection="column";
        section.style.alignItems="center";
        section.style.backgroundColor="transparent";
        container.style.cssText = "position:absolute;margin-inline:auto;margin-block:1rem;display:flex;justify-content:flex-start;flex-direction:column;align-items:center;gap:1rem;padding-inline:2rem;padding-block:1rem;padding-inline:3rem;backround-color:white;border-radius:16px;background-color:white;padding:1rem;font-size:18px;max-width:650px;width:100%;";
        container.style.zIndex="0";
        // container.style.inset=section.style.inset;
        //LOGO
        const paraLogo=document.createElement("p");
        paraLogo.id="paraLogo";
        paraLogo.style.cssText="margin-inline;auto;font-family:LobsterTwo-Regular;color:white;font-size:18px;padding-inline:1rem;line-height:2.75rem;border-radius:15px;background-color:#0C090A";
        const img=document.createElement("img");
        img.src=Misc.sourceImage({src:this.logo,width:125,quality:75});
        img.alt="www.ablogroom.com";
        img.style.cssText="shape-outside:circle(50%);border-radius:50%;aspect-ratio: 1 / 1;width:155px;filter:drop-shadow(0 0 0 0.5rem white);float:left;line-height:2.54rem;margin-right:1rem;margin-block:1.5rem;box-shadow:1px 1px 12px 1px white;";
        paraLogo.appendChild(img);
        paraLogo.innerHTML+="When Registering, we Keep Your Information Secret and Provide the Means Allowing You the Option on keeping your Information hiding with the highest regard to safeguard your email.";
        container.appendChild(paraLogo);
        //LOGO
       
        const form=document.createElement("form");
        form.style.cssText="margin:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;width:fit-content;";
        form.id="register-form";
        const {input:name,label:lname}=Nav.inputComponent(form);
        name.name="name";
        name.autocomplete="name";
        name.id="register-form-name";
        name.type="text";
        name.value="";
        lname.setAttribute("for",name.id);
        lname.textContent="name";
        name.placeholder="full name";
        const {input:email,label:lemail,formGrp:femail}=Nav.inputComponent(form);
        email.name="email";
        email.pattern="[0-9a-zA-Z]{2,}\@[a-z]{2,}\.[a-z]{2,3}";
        email.id="register-form-email";
        email.type="email";
        email.autocomplete="on";
        email.value="";
        lemail.setAttribute("for",email.id);
        lemail.textContent="email";
        email.placeholder="your@email.com";
        const divPass=document.createElement("div");
        divPass.style.cssText="margin-inline:auto;display:flex;justify-content:center;align-items:center;padding:1rem;background-color:rgb(4 10 63 / 97%);border-radius:12px;"
        const {input:pass,label:lpass,formGrp:fpass}=Nav.inputComponent(divPass);
        pass.name="password";
        pass.pattern="[0-9a-zA-Z\?\!]{5,}";
        pass.id="register-form-password";
        pass.type="password";
        pass.value="";
        pass.autocomplete="on";
        lpass.setAttribute("for",pass.id);
        lpass.textContent="password";
        pass.placeholder="at least five characters please";
        const {input:vpass,label:lvpass,formGrp:fvpass}=Nav.inputComponent(divPass);
        vpass.name="verify-password";
        vpass.pattern="[0-9a-zA-Z\?\!]{5,}";
        vpass.id="register-form-verify-password";
        vpass.type="password";
        vpass.autocomplete="on";
        vpass.value="";
        lvpass.setAttribute("for",pass.id);
        lvpass.textContent="password again for you";
        vpass.placeholder="at least five characters please";
        form.appendChild(divPass);
        const {textarea:bio,label:lbio}=Nav.textareaComponent(form);
        bio.name="bio";
        bio.id="register-form-bio";
        bio.rows=4;
        bio.style.cssText="min-width:300px;width:100%;"
        lbio.setAttribute("for",bio.id);
        lbio.textContent="who you are"
        bio.placeholder="your summary";
        const {input:showinfo,label:lshowinfo}=Nav.inputComponent(form);
        showinfo.className="";
        showinfo.name="showinfo";
        showinfo.id="register-form-showinfo";
        showinfo.type="checkbox";
        showinfo.checked=true;
        lshowinfo.setAttribute("for",pass.id);
        lshowinfo.textContent="show your name and email?";
        const {button:submit}=Misc.simpleButton({anchor:form,type:"submit",bg:Nav.btnColor,color:"white",text:"submit",time:400});
        submit.disabled=true;
        email.onchange=(e:Event)=>{
            if(e){
                const email_=(e.currentTarget as HTMLInputElement).value;
                this.checkEmailReg({femail:femail,email:email_,btn:submit})
            }
        };
        pass.onchange=(e:Event)=>{
            if(e){
                const passValue=(e.currentTarget as HTMLInputElement).value;
                this.showPasswordMatch({formPass:fpass,pass:passValue,vpass:null,change:false,btn:submit})
            }
        };
        vpass.onchange=(e:Event)=>{
            if(e){
                const vpassValue=(e.currentTarget as HTMLInputElement).value;
                const passValue=(pass as HTMLInputElement).value;
                this.showPasswordMatch({formPass:fvpass,pass:passValue,vpass:vpassValue,change:true,btn:submit})
            }
        };
        container.appendChild(form);
        section.appendChild(container);
        
        
        Misc.matchMedia({parent:container,maxWidth:400,cssStyle:{flexDirection:"column",justifyContent:"center",alignItems:"center"}});
        Misc.matchMedia({parent:divPass,maxWidth:400,cssStyle:{flexDirection:"column",justifyContent:"center",alignItems:"center"}});
        Misc.growIn({anchor:container,scale:0,opacity:0,time:400});

        form.onsubmit=(e:SubmitEvent)=>{
            if(e){
                e.preventDefault();
                const formdata= new FormData(e.currentTarget as HTMLFormElement);
                const password=formdata.get("password") as string;
                const verifyPassword=formdata.get("verify-password") as string;
                const email=formdata.get("email") as string;
                const name=formdata.get("name") as string;
                const bio=formdata.get("bio") as string;
                const showinfo=Boolean(formdata.get("showinfo") as string);
                if(verifyPassword !==password){
                    this.showPasswordMatch({formPass:fpass,pass:password,vpass:verifyPassword,change:false,btn:submit})
                }
                const user={...this._user.user,email,name,password,bio:bio,showinfo:showinfo};
                this._service.registerUser(user).then(async(user_)=>{
                    if(user_){
                            this._user.user={...user_,password:user.password};
                            container.removeChild(form);
                            //ADD IMAGE DISPLAY ON CONTAINER FROM HERE
                            const image=document.createElement("img");
                            image.style.cssText="width:150px;border-radius:50%;box-shadow:1px 1px 12px 1px black;position:absolute;inset:0%;filter:drop-shadow(0 0 0.5rem black);margin:auto;";
                            const user_id=this._user.user.id as string;
                           await this._service.newUserEMailTo(user_id)
                            this.wantProfileImage(mainHeader,section,container,image,user_);
                            // /auth/new-user url is used for new user and therefore this is not needed for first time user
                            // await this._service.welcomeEmail(user.id)//AUTH/NEW-USER HANDLES THIS
                    }
                });
            }
        };
    }
    wantProfileImage(mainHeader:HTMLElement,section:HTMLElement,container:HTMLElement,image:HTMLImageElement,user:userType){
        //THIS GIVES THE USER TWO CHOICES CLOSE UPLOADING IMAGE AND OPEN SIGNIN POPUP OR UPLOAD IMAGE THEN GO TO SIGNIN
        const popup=document.createElement("div");
        popup.id="ask-profile-image-upload";
        popup.style.cssText="margin-inline:auto;position:absolute;inset:0%;background-color:white;border-radius:12px;box-shadow:1px 1px 12px 1px black;padding:1rem;";
        const text=document.createElement("h6");
        text.textContent="profile upload?";
        text.className="text-center text-primary text-decoration-underline text-underline-offset-3 mb-4";
        popup.appendChild(text);
        const divGrp=document.createElement("div");
        divGrp.style.cssText="margin:auto;display:flex;justify-content:space-around;align-items:center;"
        const {button:close}=Misc.simpleButton({anchor:divGrp,text:"not now",type:"button",bg:"black",color:"white",time:400});
        const {button:upload}=Misc.simpleButton({anchor:divGrp,text:"upload image",type:"button",bg:"blue",color:"white",time:400});
        popup.appendChild(divGrp);
        section.appendChild(popup);
        close.onclick=(e:MouseEvent)=>{
            if(e){
                Misc.growOut({anchor:section,scale:0,opacity:0,time:400});
                setTimeout(async()=>{
                    const providers= await getProviders()
                    const csrfToken=await getCsrfToken();
                    if(!providers && !csrfToken){
                        //DIRECTING USER TO SIGNIN IF CAN'TE GET PROVIDERS
                        const url=new URL(window.location.href);
                        const newUrl= new URL("/",url.origin);
                        window.location.href=newUrl.href;
                    }else if(providers && csrfToken){
                        //removing container
                        section.removeChild(container);
                        //pulling up form for signIn
                        Object.values(providers).map(provider=>{
                            if((provider.id as unknown as string)==="credentials"){
                                const signInCallBack=provider.callbackUrl as unknown as string;
                                this.signInForm(section,signInCallBack,csrfToken);
                                //closing popup
                                Misc.growOut({anchor:popup,scale:0,opacity:0,time:400});
                                setTimeout(()=>{section.removeChild(popup)},390);
                            }
                        });
                    }
                    
                },300);
            }
        };
        upload.onclick=(e:MouseEvent)=>{
            if(e){
                //uploading file import for upload image
                this.userImageForm(mainHeader,section,container,image,user);
                //closing popup
                Misc.growOut({anchor:popup,scale:0,opacity:0,time:400});
                setTimeout(()=>{section.removeChild(popup)},390);
            }
        };
    }
    userImageForm(mainHeader:HTMLElement,section:HTMLElement,subSection:HTMLElement,image:HTMLImageElement,user:userType){
        const{form,reParent:reSubSection,label}=Misc.imageForm(subSection,null);
        form.id="register-image-form";
        form.style.minWidth="250px";
        form.style.cssText="margin-inline:auto;display:flex;flex-direction:column;min-width:250px;box-shadow:1px 1px 12px 1px black;border-radius:12px;padding:1rem;align-items:center;";
        label.textContent="add you profile pic";
        form.onsubmit=async(e:SubmitEvent)=>{
            if(e){
                e.preventDefault();
                const formdata=new FormData(e.currentTarget as HTMLFormElement);
                const file=formdata.get("file") as File;
                if(!file ) return;
                if(!( file && file.name as string)) return;
                const urlImg=URL.createObjectURL(file);
                image.src=urlImg;
                image.alt=file.name as string;
                reSubSection.removeChild(form);
                reSubSection.appendChild(image);
                Misc.blurIn({anchor:image,blur:"20px",time:500});
                this.removeItem({parent:mainHeader,target:section});
                const blog={...this._modSelector.blog,name:user.name,user_id:user.id}
                
                this._service.generateImgKey(formdata,blog);
                await this._service.simpleImgUpload(section,formdata).then(async(res)=>{
                    if(res){
                        user={...user,imgKey:res.Key}
                        this._user.user=user;
                        this._service.updateUser(user).then(async(user_)=>{
                            if(user_ ){
                                Misc.message({parent:section,type_:"success",time:700,msg:"saved"})
                                this._user.user={...user_,password:user.password};
                                //removing subsection
                                Misc.growOut({anchor:reSubSection,scale:0,opacity:0,time:400});
                                setTimeout(()=>{
                                    section.removeChild(reSubSection)
                                },390);
                                
                            }else{
                                Misc.message({parent:section,type_:"error",time:1000,msg:"was not updated"})
                            }
                            const providers= await getProviders()
                                const csrfToken=await getCsrfToken();
                                if(!providers && !csrfToken){
                                    //DIRECTING USER TO HOME IF CAN'TE GET PROVIDERS
                                    const url=new URL(window.location.href);
                                    const newUrl= new URL("/",url.origin);
                                    window.location.href=newUrl.href;
                                }else if(providers && csrfToken){
                                    //pulling up form for signIn this will take the use to home page afterwards
                                    Object.values(providers).map(provider=>{
                                        if((provider.id as unknown as string)==="credentials"){
                                            const signInCallBack=provider.callbackUrl as unknown as string;
                                            this.signInForm(section,signInCallBack,csrfToken);
                                        }
                                    });
                                }
                        }).catch((err)=>{const msg=getErrorMessage(err);console.error(msg);Misc.message({parent:section,type_:"error",time:1000,msg:msg})});
                    }
                });
            }
        };
     }
     
    signiMain(section:HTMLElement,providers:providerType[],csrfToken:string|undefined){
        Header.cleanUpByID(section,"signIn-main");
        // const cssGrp="margin:auto;display:flex;flex-direction:column;align-items:center;gap:1rem;";
        section.style.position="relative";
        section.style.zIndex="20";
        // const width=window.innerWidth <500 ? "0%":"30%";
        const container=document.createElement("section");
        container.id="signIn-main";
        container.style.cssText="margin:auto;position:relative;background-color:white;filter:drop-shadow(0 0 0.75rem crimson);border-radius:7px;padding:1rem;;z-index:1000;display:flex;flex-direction:column;align-items:center;gap:2rem;padding:1.5rem;";
        Object.values(providers).map((provider)=>{
            //provider={callbackUrl:string=>https://,,,api/auth/callback/credentials or google,id:string=>"credentials/google",name:string,signinUrl:string=>http://local,,,api/auth/credentials}
            const signInCallBack=provider.callbackUrl as unknown as string;
            if((provider.id as unknown as string)==="credentials"){
                this.signInForm(container,signInCallBack,csrfToken);
            }else{
                this.signInProvider(container,signInCallBack,provider);

            }
        });
        section.appendChild(container);
    }

    signInForm(parent:HTMLElement,signinUrl:string|undefined,csrfToken:string|undefined):{btn:HTMLButtonElement,container:HTMLElement,form:HTMLFormElement,email:HTMLInputElement,password:HTMLInputElement}{
        const user=this._user.user;
        const cssGrp="margin:auto;display:flex;flex-direction:column;align-items:center;gap:1rem;";
        // const width=window.innerWidth <500 ? "0%":"30%";
        const container=document.createElement("section");
        container.id="container-signIn";
        container.style.cssText="margin:auto;background-color:white;filter:drop-shadow(0 0 0.75rem crimson);border-radius:7px;padding:1rem;;z-index:1000;display:flex;align-items:center;gap:1rem;flex-direction:column;";
        container.style.width=`clamp(300px,400px,450px)`;
        container.style.minHeight=`auto`;
        const form=document.createElement("form");
        form.id="signin-form";
        form.method="POST";
        if(signinUrl){
            form.action=signinUrl;
        }
        if(csrfToken){
            const csrfInput=document.createElement("input");
            csrfInput.hidden=true;
            csrfInput.type="hidden";
            csrfInput.name="csrfToken";
            csrfInput.value=csrfToken;
            form.appendChild(csrfInput);
        }
        form.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;";
        form.id="signInForm-credentials"
        const {input:email,label:labelEmail,formGrp:grpEmail}=Nav.inputComponent(form);
        grpEmail.style.cssText=cssGrp;
        grpEmail.style.cssText="margin:auto;display:flex;flex-direction:column;align-items:center;gap:1rem;"
        email.placeholder="your email";
        email.type="email";
        email.autocomplete="email";
        email.value=user && user.email ? user.email :"";
        email.pattern="[a-zA-Z0-9\.]{2,}@[a-zA-Z0-9]{2,}\.[a-z]{2,3}";
        email.id="signInForm-credentials-emails";
        labelEmail.textContent="email";
        labelEmail.classList.add("display-6");
        labelEmail.setAttribute("for",email.id);
        email.name="email";
        email.autocomplete="email";
        email.placeholder=" requires a form of mymail@mail.com"
        const {input:password,label:labelPass,formGrp:grpPassword}=Nav.inputComponent(form);
        grpPassword.style.cssText=cssGrp;
        password.type="password";
        password.id="signInForm-credentials-password"
        password.pattern="[a-zA-Z0-9\.\?\-]{5,}";
        password.value=user && user.password ? user.password : "";
        password.autocomplete="on";
        labelPass.textContent="password";
        labelPass.classList.add("display-6");
        labelPass.setAttribute("for",password.id);
        password.placeholder="must be more that 5 characters";
        password.name="password";
        const {button:btn}=Misc.simpleButton({anchor:form,color:"white",bg:Misc.btnColor,text:"submit",type:"submit",time:400});
        //APPENDING FORM TO POPUP
        container.appendChild(form);
        //APPENDING POPUP TO PARENT
        parent.appendChild(container);
        email.onchange=async(e:Event)=>{
            if(e){
                
                const evalue=(e.currentTarget as HTMLInputElement).value;
                await this.checkEmailSignin({femail:grpEmail,email:evalue,btn:btn})
            }
        };
        password.onchange=(e:Event)=>{
            if(e){
                const pValue=(e.currentTarget as HTMLInputElement).value;
                if(pValue && pValue !==""){
                    this.checkPassSignin({fpass:grpPassword,pass:pValue,btn:btn});
                }
            }
        };
            
        //------------window on load------------------//
        window.scroll(0,0);
        container.animate([
            {transform:"translateY(-100%)",opacity:0},
            {transform:"translateY(0%)",opacity:1},
           ],{duration:300,iterations:1});
           //-------------window on load--------------------//
           
        
        Misc.matchMedia({parent:container,maxWidth:900,cssStyle:{width:"80%"}});
        Misc.matchMedia({parent:container,maxWidth:500,cssStyle:{width:"100%"}});
        Misc.growIn({anchor:container,scale:0,opacity:0,time:400});
        
        return {btn,container,form,email,password}
    }

     signInProvider(parent:HTMLElement,signinUrl:string|undefined,provider:providerType,):{container:HTMLElement}{
        //Misc.providersImgs
        const container=document.createElement("div");
        container.style.cssText="margin:auto;display:flex;justify-content:center;align-items:center;gap:1rem;flex-direction:column;position:relative;";
       
            Misc.providersImgs.map(item=>{
                if(item.name==="google" && (provider.id as unknown as string) ==="google"){
                   
                    const grp=document.createElement("div");
                    grp.id=`${item.name}-container`;
                    grp.style.cssText="margin:auto;width:100%;display:flex;align-items:center;justify-content:center;gap:1rem;flex-direction:column;"
                    const title=document.createElement("h6");
                    title.className="text-center text-primary text-decoration-underline text-underline-offset-2 my-1 lean display-6";
                    title.textContent=provider.name as unknown as string;
                    const img=document.createElement("img");
                    img.src=item.img;
                    img.alt="google";
                    img.style.cssText="max-width:250px;margin-inline:1rem";
                    grp.appendChild(title);
                    grp.appendChild(img);
                    const {button}=Misc.simpleButton({anchor:grp,bg:Nav.btnColor,color:"white",type:"button",time:400,text:"submit"});
                    container.appendChild(grp);
                    button.onclick=() => {
                        const providerID= provider.id as unknown as LiteralUnion<BuiltInProviderType> | undefined
                        signIn(providerID)
                        // Misc.message({parent,msg:"sent",type_:"success",time:600});
                    };

                }else if(item.name==="facebook" && (provider.id as unknown as string) ==="facebook"){
                    const grp=document.createElement("div");
                    grp.id=`${item.name}-container`;
                    grp.style.cssText="margin:auto;width:100%;display:flex;align-items:center;justify-content:center;gap:1rem;flex-direction:column;"
                    const title=document.createElement("h6");
                    title.className="text-center text-primary text-decoration-underline text-underline-offset-2 my-1 lean display-6";
                    title.textContent=provider.name as unknown as string;
                    const img=document.createElement("img");
                    img.src=item.img;
                    img.alt=item.name;
                    img.style.cssText="max-width:250px;margin-inline:1rem";
                    grp.appendChild(title);
                    grp.appendChild(img);
                    const {button}=Misc.simpleButton({anchor:grp,bg:Nav.btnColor,color:"white",type:"button",time:400,text:"submit"});
                    container.appendChild(grp);
                    button.onclick=() => {
                        const providerID= provider.id as unknown as LiteralUnion<BuiltInProviderType> | undefined
                        signIn(providerID)
                    };
                }
            });
        
        parent.appendChild(container);
        return {container}

    }
     
     showPasswordMatch(item:{formPass:HTMLElement,pass:string,vpass:string|null,change:boolean,btn:HTMLButtonElement}){
        const {formPass,pass,vpass,btn}=item;
        Header.cleanUpByID(formPass,"showPasswordmatch");
        const checkOne=this.pReg.test(pass) ? true:false;
        const checkTwo=(vpass && this.pReg.test(pass) && this.pReg.test(vpass) && pass===vpass) ? true:false;
        const container=document.createElement("div");
        container.id="showPasswordmatch"
        formPass.style.position="relative";
        container.style.cssText="position:absolute;z-index:200;width:100%;top:-290%;left:0%;right:0%;color:red;padding:1rem;border-radius:12px;box-shadow:1px 1px 12px 1px black;background-color:white;box-shadow:1px 1px 12px 1px black;margin-block:1.5rem;";
        const text=document.createElement("p");
        if(!checkTwo && (pass && vpass)){
            btn.disabled=true;
            btn.textContent="disabled";
            text.textContent="passwords are not equal. please verify,,,";
            container.appendChild(text);
        }
        else if(!checkOne && !vpass){
            btn.disabled=true;
            btn.textContent="disabled";
            text.textContent="password needs to be atleast 5-characters long";
            container.appendChild(text);
        }else{
            btn.disabled=false;
            btn.textContent="sign in";
            text.textContent="thanks";
            container.appendChild(text);
        }
        
        formPass.appendChild(container);
        container.animate([
            {transform:"scale(0.2)",opacity:"0.4"},
            {transform:"scale(1)",opacity:"1"},
        ],{duration:400,iterations:1});
        setTimeout(()=>{
            Misc.growOut({anchor:container,scale:0,opacity:0,time:400});
            setTimeout(()=>{
                formPass.removeChild(container);
            },390);
        },1200);
     }
     async checkEmailSignin(item:{femail:HTMLElement,email:string,btn:HTMLButtonElement}){
        const {femail,email,btn}=item;
        femail.style.position="relative";
        femail.style.zIndex="3";
        Header.cleanUpByID(femail,"checkEmail");
        const check=this.eReg.test(email);
        const container=document.createElement("div");
        container.id="checkEmail";
        container.style.cssText="position:absolute;top:-160%;background-color:white;color:red;padding:1rem;text-wrap:pretty;display:flex;flex-direction:column;justify-content:center;align-items:center;box-shadow:1px 1px 12px 1px black;border-radius:12px;";
        const text=document.createElement("p");
        text.style.cssText="margin-inline:auto;text-wrap:pretty";
        if(!check){
            btn.disabled=true;
            text.textContent="their is a mistake in your email, please verify";
            container.appendChild(text);
            femail.appendChild(container);
            btn.textContent="disabled";
            Misc.growIn({anchor:container,scale:0,opacity:0,time:400});
        }if(check){
            const user={...this._user.user,email:email}
            await this._service.check_email(user).then(async(user)=>{
                if(user && user.email){
                    btn.disabled=false;
                    btn.textContent="sign in";
                    text.style.cssText="margin-inline:auto;text-wrap:pretty";
                    text.textContent="thanks";
                    this.count=0;
                    container.appendChild(text);
                    femail.appendChild(container);
                    Misc.growIn({anchor:container,scale:0,opacity:0,time:800});
                    setTimeout(()=>{
                        Misc.growOut({anchor:container,scale:0,opacity:0,time:400});
                        setTimeout(()=>{
                            femail.removeChild(container)
                        },398);
                    },800);
                }else{
                    if(this.count < 1){
                        this.count +=1;

                        btn.disabled=true;
                        btn.textContent="disabled";
                        text.textContent="email does not exist";
                        container.appendChild(text);
                        femail.appendChild(container);
                        Misc.growIn({anchor:container,scale:0,opacity:0,time:400});
                    }else{
                        //second missed email=> sends client to register page
                        const base=new URL(window.location.href);
                        const newUrl=new URL("/register",base.origin)
                        window.location.href=newUrl.href
                    }
                }
            });
        }
     }
     checkPassSignin(item:{fpass:HTMLElement,pass:string|null,btn:HTMLButtonElement}){
        const {fpass,pass,btn}=item;
        fpass.style.zIndex="3";
        fpass.style.position="relative";
        Header.cleanUpByID(fpass,"checkPass");
        const check=pass && this.pReg.test(pass);
        const container=document.createElement("div");
        container.id="checkPass";
        container.style.cssText="position:absolute;top:-160%;background-color:white;color:red;padding:1rem;text-wrap:pretty;display:flex;flex-direction:column;justify-content:center;align-items:center;box-shadow:1px 1px 12px 1px black;border-radius:12px;";
        const text=document.createElement("p");
        text.style.cssText="margin-inline:auto;text-wrap:pretty";
        if(check){
            Misc.growOut({anchor:container,scale:0,opacity:0,time:500});
            setTimeout(()=>{
                fpass.removeChild(container);
            },490);
            btn.disabled=false;
        }else{
            text.textContent="please enter a password more than 5 characters long."
            btn.disabled=true;
        }
        container.appendChild(text);
        fpass.appendChild(container);
        Misc.growIn({anchor:container,scale:0,opacity:0,time:400});

     }
     async checkEmailReg(item:{femail:HTMLElement,email:string,btn:HTMLButtonElement}){
        //CHECKS EMAIL FORMAT && VERIFIES IF EMAIL EXIST ON DB
        const {femail,email,btn}=item;
        femail.style.position="relative";
        Header.cleanUpByID(femail,"checkEmail");
        const check=this.eReg.test(email);
        const container=document.createElement("div");
        container.id="checkEmail";
        container.style.cssText="position:absolute;top:-160%;background-color:white;color:red;padding:1rem;text-wrap:pretty;display:flex;flex-direction:column;justify-content:center;align-items:center;box-shadow:1px 1px 12px 1px black;border-radius:12px;";
        const text=document.createElement("p");
        text.style.cssText="margin-inline:auto;text-wrap:pretty";
        if(!check){
            btn.disabled=true;
            text.textContent="their is a mistake in your email, please verify";
            container.appendChild(text);
            femail.appendChild(container);
            Misc.growIn({anchor:container,scale:0,opacity:0,time:400});
        }if(check){
            const user={...this._user.user,email:email}
            //tries fiv times before transfering to error page
            await this._service.check_email(user).then(async(user:userType|null|undefined)=>{
                this.count +=1;
                if(this.count < 4){
                    const isEmail=(user && user.email) ? true:false
                    if(isEmail){
                        btn.disabled=true;
                        text.textContent=`email:${user && user.email} already exist,,try again`;
                        container.appendChild(text);
                        femail.appendChild(container);
                        Misc.growIn({anchor:container,scale:0,opacity:0,time:400});
                    }else{
                        btn.disabled=false;
                        text.textContent="thanks";
                        container.appendChild(text);
                        femail.appendChild(container);
                        this.count=0;
                        Misc.growIn({anchor:container,scale:0,opacity:0,time:800});
                        setTimeout(()=>{
                            Misc.growOut({anchor:container,scale:0,opacity:0,time:400});
                            setTimeout(()=>{
                                femail.removeChild(container)
                            },398);
                        },800);

                    }
                }else{
                    //sending client to error page with no history
                    const base=new URL(window.location.href);
                    const newUrl=new URL("/error_page",base.origin);
                    window.location.replace(newUrl);
                }
                });
            }
           
        
     }
     removeItem(item:{parent:HTMLElement,target:HTMLElement}){
        const {parent,target}=item;
        const xDivIcon=document.createElement("div");
        xDivIcon.id="delete-mainSignin";
        xDivIcon.className="delete";
        xDivIcon.style.cssText="position:absolute;top:0%;left:100%;transform:translate(-15px,2px);";
        FaCreate({parent:xDivIcon,name:FaCrosshairs,cssStyle:{color:"blue",fontSize:"1rem"}});
        //creating cancel
        //APPENDING CANCEL TO FORM
        target.appendChild(xDivIcon);
        xDivIcon.onclick=(e:MouseEvent)=>{
            if(e){
                const url=new URL(window.location.href);
                const base=url.origin;
                const pathname=url.pathname;
                if(pathname==="/signin"){
                    window.location.href=base;
                }else{

                    Misc.fadeOut({anchor:target,xpos:50,ypos:100,time:400});
                    setTimeout(()=>{
                        parent.removeChild(target);
                    },398);
                }
            }
        };
     }
}
export default RegSignIn
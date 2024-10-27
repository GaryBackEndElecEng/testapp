import type { Metadata,ResolvingMetadata,MetadataRoute } from 'next';
import {PrismaClient } from '@prisma/client';
import { awsImage, getAllBlogImages, getOnlyBlogImages, getUserImage, getUsersImage } from '@/lib/awsFunctions';
import { blogType, postType, userType } from '../editor/Types';
import { getErrorMessage } from '@/lib/errorBoundaries';

const prisma=new PrismaClient();
const DOMAIN=process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL as string : process.env.DOMAIN as string;
export type Props = {
  params: {id:string },
  // searchParams: { [key: string]: string | string[] | undefined }
}
export type getBlogType={
  image: string,
  name: string,
  title:string,
  desc: string | undefined,
  user_id:string
}|null



class Meta{
    pages:{page:string,redir:RegExp,match:RegExp}[];
    static isExist:boolean=false;
    params:string[];
    constructor(){
      //BELOW PAGES HELPS REDIRECT THE PAGE TO THE ERROR_PAGE IF THE PAGE DOES NOT EXIST
        this.pages=[
          {page:'/az',redir:/\/[a-z]{1,3}\//,match:/\//},
          {page:'/blog/',redir:/\/(blog)\/[0-9]+[a-z\/]+/,match:/\/(blog)\/[0-9]+/},
          {page:'/blogs',redir:/\/(blogs)[a-zA-Z\/]+/,match:/\/(blogs)/},
          {page:"/register",redir:/\/(register)[a-zA-Z\/]+/,match:/\/(register)/},
          {page:"/editor",redir:/\/(editor)[a-zA-Z\/]+/,match:/\/(editor)/},
          {page:"/policy",redir:/\/(policy)[a-zA-Z\/]+/,match:/\/(policy)/},
          {page:"/termsOfService",redir:/\/(termsOfService)[a-zA-Z\/]+/,match:/\/(termsOfService)/},
          {page:"/admin",redir:/\/(admin)[a-zA-Z\/]+/,match:/\/(admin)/},
          {page:"/error_page",redir:/\/(error_page)[a-zA-Z\/]+/,match:/\/(error_page)/},
          {page:"/posts",redir:/\/(posts)[a-zA-Z\/]+/,match:/\/(posts)/},

        ]
        this.params=["blog_id","misc","intent"]
    }
     checkPathname(){
      const url=new URL(window.location.href);
      const pathname=url.pathname;
      this.pages.map(page=>{
        if((page.redir.test(pathname))){
          const newUrl=new URL(`/error_page?misc=${pathname}&intent=${page.page}`,url.origin);
          window.location.replace(newUrl.href);
        }
      });
     
  }

    static metaBlogs():Metadata{
        const kwords=[ "comments and messages", "comments", "ask Us something", "helping you connect", " message board"];
        const metadata:Metadata ={
            title: {
                default: "blogs",
                template: `%s | blogs`,
            
            },
           
            
            description: "Comment page",
            keywords:[ "comments and messages", "comments", "ask Us something", "helping you connect", " message board"],
            
            alternates: {
                canonical: "/blogs",
                languages: {
                "en-US": "/en-US",
                "fr-CA": "/fr-CA"
                }
            },
            openGraph: {
                title: "Blogs",
                description: 'blogs',
                url: "/blogs",
                images: [
                {
                    url: "/images/gb_logo.png",
                    width: 300,
                    height: 300
                },
                {
                    url: "/images/display/symetric.png",
                    width: 400,
                    height: 300
                },
                {
                    url: "https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/logoLarge.png",
                    width: 600,
                    height: 900
                },
                ],
          }
        }
        return metadata;
    }
    static metaPosts():Metadata{
        const kwords=[ "comments and messages", "posts", "Free Posts", "publisize your thoughts", "Happy Posts"];
        const metadata:Metadata ={
            title: {
                default: "posts",
                template: `%s | posts`,
            
            },
            description: "Post page",
            keywords:kwords,
            
            alternates: {
                canonical: "/posts",
                languages: {
                "en-US": "/en-US",
                "fr-CA": "/fr-CA"
                }
            },
            openGraph: {
                title: "Posts",
                description: 'Quick and Free Posts for you',
                url: "/blogs",
                images: [
                {
                    url: "/images/gb_logo.png",
                    width: 300,
                    height: 300
                },
                {
                    url: "/images/display/symetric.png",
                    width: 400,
                    height: 300
                },
                {
                    url: "https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/logoLarge.png",
                    width: 600,
                    height: 900
                },
                ],
          }
        }
        return metadata;
    }
    static metaHome():Metadata{
        return {
            metadataBase: new URL(DOMAIN),
            title: {
              default: "ablogroom",
              template: `%s | ablogroom`,
          
            },
            verification: {
              google: 'S88O7lTinqgyYLB8h1x2fOusiDQY9V68xuDpUZevLQY',
              yandex: 'yandex',
              yahoo: 'yahoo',
              other: {
                name: ['masterconnect919@gmail.com', 'https://www.masterconnect.ca/contact'],
              },
            },
            category:"blog",
            description: 'Generated by www.masterconnect.ca,Free Blog Creation for you. It provides templates that the user can use to become an effective blogger. The Blog Room has all the effective tools for the blogger to fine-tune their skills in blogging.',
            generator: "Next.js",
            applicationName: "ablogroom",
            referrer: "origin-when-cross-origin",
            keywords: ["The Blog Room, Free to use", "blogs for you", "web info", "free blog posts", " The World is Your Oyster", " Create Your Own Blog", "Gary's Blogs"],
            authors: [{ name: "Gary Wallace", url: "https://www.masterconnect.ca" }],
            // colorScheme:"light",
            creator: "Gary Wallace",
            publisher: "Gary Wallace",
            formatDetection: {
              email: true,
              address: false,
              telephone: true
            },
            openGraph: {
              title: "ablogroom",
              description: 'Generated by www.masterconnect.ca,tools for you',
              url: "https://www.ablogroom.com",
              siteName: "ablogroom",
              images: [
                {
                  url: "/images/gb_logo_600.png",
                  width: 600,
                  height: 600
                },
                {
                  url: "/images/gb_logo_800_400.png",
                  width: 800,
                  height: 400
                },
              ],
              locale: "en-CA",
              type: "website"
          
            },
            robots: {
              index: false,
              follow: true,
              nocache: false,
              googleBot: {
                index: true,
                follow: false,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
              },
            },
            icons: {
                icon: '/icon.png',
                shortcut: '/icon.png',
                apple: '/icon.png',
                other: {
                  rel: 'apple-touch-icon-precomposed',
                  url: '/icon.png',
                },
            },
            appleWebApp: {
              title: 'A Blog room',
              statusBarStyle: 'black-translucent',
              startupImage: [
                '/assets/startup/apple-touch-startup-image-768x1025.png',
                {
                  url: '/images/gb_logo768x1025.png',
                  media: '(device-width: 768px) and (device-height: 1024px)',
                },
              ],
            },
          
            
          
          
          }
    }
    static metaBlog():Metadata{
        return {
            title: {
              default: "blog",
              template: `%s | blog`,
          
            },
            
          
            description: ' blog page:Generated by www.masterconnect.ca,Free Blog Creation for you. It provides templates that the user can use to become an effective blogger.',
            generator: "Next.js",
            applicationName: "ablogroom",
            referrer: "origin-when-cross-origin",
            keywords: ["The Blog Room, Free to use", "blogs for you", "web info", "free blog posts", " The World is Your Oyster", " Create Your Own Blog", "Gary's Blogs"],
            authors: [{ name: "Gary Wallace", url: "https://www.masterconnect.ca" }],
            // colorScheme:"light",
            creator: "Gary Wallace",
            publisher: "Gary Wallace",
            formatDetection: {
              email: true,
              address: false,
              telephone: true
            },
            openGraph: {
              title: "ablogroom",
              description: 'Generated by www.masterconnect.ca,tools for you',
              url: "https://www.ablogroom.ca",
              siteName: "ablogroom",
              images: [
                {
                  url: "/images/gb_logo.png",
                  width: 600,
                  height: 600
                },
                {
                  url: "https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/masterUltils800_400.png",
                  width: 800,
                  height: 400
                },
              ],
              locale: "en-CA",
              type: "website"
          
            },
            robots: {
              index: false,
              follow: true,
              nocache: false,
              googleBot: {
                index: true,
                follow: false,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
              },
            },
            icons: {
                icon: '/icon.png',
                shortcut: '/icon.png',
                apple: '/icon.png',
                other: {
                  rel: 'apple-touch-icon-precomposed',
                  url: '/icon.png',
                },
            },
            viewport: {
              width: 'device-width',
              initialScale: 1,
              maximumScale: 1,
            },
          
            appleWebApp: {
              title: 'Apple Web App',
              statusBarStyle: 'black-translucent',
              startupImage: [
                '/assets/startup/apple-touch-startup-image-768x1025.png',
                {
                  url: '/assets/startup/apple-touch-startup-image-1536x2051.png',
                  media: '(device-width: 768px) and (device-height: 1024px)',
                },
              ],
            },
          
          
          }
    }
    metaChart():Metadata{
      const kwords=[ "custom charts", "realtime climate change", "make your own graph", "helping you connect", "free Graph making"];
      const metadata:Metadata ={
          title: {
              default: "chart",
              template: `%s | chart`,
          
          },
          description: "create a Chart",
          keywords:[ "custom charts", "realtime climate change", "make your own graph", "helping you connect", "free Graph making"],
          
          alternates: {
              canonical: "/chart",
              languages: {
              "en-US": "/en-US",
              "fr-CA": "/fr-CA"
              }
          },
          openGraph: {
              title: "Charts",
              description: 'Customize your chart, free for all',
              url: "/chart",
              images: [
              {
                  url: "/images/gb_logo.png",
                  width: 300,
                  height: 300
              },
              {
                  url: "/images/display/symetric.png",
                  width: 400,
                  height: 300
              },
              {
                  url: "https://new-master.s3.ca-central-1.amazonaws.com/static/masterultils/logoLarge.png",
                  width: 600,
                  height: 900
              },
              ],
          }
      }
      return metadata;
    }
    static metaEditor():Metadata{
      const kwords=[ "Best Blog Builder in Canada","customize your Blog", "Dynamic Blog/Website editor", "Free Web/Blog builder", "helping you connect through Blogging", "Best in Canada"];
      const metadata:Metadata ={
          title: {
              default: "Editor",
              template: `%s | Editor`,
          
          },
          description: "Build your Blog",
          keywords:kwords,
          
          alternates: {
              canonical: "/editor",
              languages: {
              "en-US": "/en-US",
              "fr-CA": "/fr-CA"
              }
          },
          openGraph: {
              title: "Editor",
              description: 'Customize your Blog, free for all',
              url: "/editor",
              images: [
              {
                  url: "/images/gb_logo.png",
                  width: 300,
                  height: 300
              },
              {
                  url: "/images/display/symetric.png",
                  width: 400,
                  height: 300
              },
              {
                  url: "/images/feature/profile.png",
                  width: 600,
                  height: 900
              },
              ],
        }
      }
      return metadata;
    }
    static async genBlogs(): Promise<{keywords: string[],descs: string[],images:string[]}>{
        const blogNames= await prisma.blog.findMany();
        const constrainBlogs=blogNames ? blogNames.filter(blog=>(blog.rating > 2)) as blogType[]:[] as blogType[];
        const blogsWithimages=constrainBlogs? await getAllBlogImages(constrainBlogs):[] as blogType[];
        const images=blogsWithimages ? blogsWithimages.map(bl=>(bl.img)).filter(img=>(img !=="undefined")) as string[] :["/images/gb_logo.png"];
        const keywords=constrainBlogs ? constrainBlogs.map(name=>(name.title as string)) :["blogs"];
        const descs=constrainBlogs ? constrainBlogs.map(name=>((name.desc as string).slice(0,20))):["blogs"];
        await prisma.$disconnect()
        return {keywords,descs,images}
    }
    static async genUsers(): Promise<{
      images: (string | undefined)[] | undefined;
      bios: (string | undefined)[] | undefined;
      names: (string | undefined)[] | undefined;
  }>{
      const users= await prisma.user.findMany({
          select:{
            name:true,
            image:true,
            imgKey:true,
            bio:true,
            email:true
          }
      });
      const newUsers=users ? await getUsersImage(users as unknown[] as userType[]):[] as userType[];
      const images=newUsers ? newUsers.map(us=>(us.image)).filter(im=>(im !=="undefined")) : [] as string[];
      const bios=newUsers ? newUsers.map(us=>(us.bio)).filter(bi=>(bi !=="undefined")):["users bio"];
      const names=newUsers ? (newUsers.map(us=>(us.name))).filter(name=>(name!==undefined)):["Gary Wallace"];
      await prisma.$disconnect();
      return {images,bios,names};
    }
    static async getUser(user_id:string):Promise<{
      image_: string,
      bio: string,
      author:{name: string,url:string},
      email: string
  }>{
      const user=await prisma.user.findUnique({
          where:{
            id:user_id
          },
      });
      const newUser=user ? await getUserImage(user as unknown as userType):{} as userType;
      const image_=newUser.image ? newUser.image :"/images/gb_logo.png";
      const bio=newUser.bio ? newUser.bio :" not included";
      const author:{ name:string, url:string }=newUser.showinfo ? {name:newUser.name as string,url:"/blog"} :{name:"ablogroom",url:"https://www.ablogroom.com"};
      const email=newUser.showinfo ? newUser.email :"masterconnect919@gmail.com";
      return {image_:image_,bio:bio,author,email:email}
    }
    static async getBlog(blog_id:number): Promise<getBlogType>{
      if(!blog_id) return {image:"",name:"",desc:"",user_id:"",title:""};
      const blog=await prisma.blog.findUnique({
        where:{id:blog_id}
      });

      Meta.isExist=blog ? false : true;
      const newBlog=blog ? await getOnlyBlogImages(blog as unknown as blogType): {} as blogType;
      const image=newBlog && newBlog.img ? newBlog.img : "/images/gb_logo.png";
      const name=newBlog && newBlog.name ? newBlog.name : "ablogroom";
      const title=newBlog && newBlog.title ? newBlog.title : "no Title";
      const desc=(newBlog && newBlog.desc) ? newBlog.desc : "no desc";
      const user_id=(newBlog && newBlog.user_id) ? newBlog.user_id as string: "";
      return {image,name,desc,user_id,title};
    }
    static async blogExist(item:{id:number}):Promise<{id:number|null,user_id:string|null}>{
      const {id}=item;
      if(!id)return {id:null,user_id:null}
      const blog=await prisma.blog.findUnique({
        where:{id}
      });
      await prisma.$disconnect();
      if(!blog) return {id:null,user_id:null}
      return {id:blog.id,user_id:blog.user_id}
    }

    static async generate_metadata(parent:ResolvingMetadata){
      const genBlogs= await Meta.genBlogs();
      const kwords:string[]=genBlogs.keywords;
      const descs:string=genBlogs.descs.join(",");
      const images:string[]=genBlogs.images;
      const referrer = (await parent).referrer;
      const previousImages = (await parent)?.openGraph?.images || []
      const prevDesc = (await parent).openGraph?.description ||"blogs";
      const keywords = (await parent).keywords || [];
      // const authors = (await parent).authors || [];
      
      const blogUrl = `/blogs`;
      const descsJoin=[descs,prevDesc].join(", ");
      const joinKWords=keywords.concat(kwords);
      const newImages = previousImages.concat(images);
      return {
        title:"blogs",
          description: descsJoin,
          keywords: joinKWords,
          // authors: newAuths,
          referrer,

          openGraph: {
              // images: [image, ...newImages],
              description: descsJoin,
              url: blogUrl,
              images:newImages
          },
      }
    }
    static async genposts_metadata(parent:ResolvingMetadata){
      const genPosts= await Meta.genPosts();
      const kwords:string[]=genPosts.map(post=>(post.title));
      const descs:string=genPosts.map(post=>(post.content?.slice(0,25))).join(",");
      const images:string[]=genPosts.length > 4 ? 
      await Promise.all(genPosts.slice(0,4).map(async(post)=>((post && post.imageKey) ? (await awsImage(post.imageKey)):""))):[];
      const referrer = (await parent).referrer;
      const previousImages = (await parent)?.openGraph?.images || []
      const prevDesc = (await parent).openGraph?.description ||"posts";
      const keywords = (await parent).keywords || [];
      // const authors = (await parent).authors || [];
      
      const postUrl = `/posts`;
      const descsJoin=[descs,prevDesc].join(", ");
      const joinKWords=keywords.concat(kwords);
      const newImages = previousImages.concat(images);
      return {
        title: {
            default: "posts",
            template: `%s | posts`,
        
        },
        description: descsJoin,
        keywords:joinKWords,
        referrer,
        
        alternates: {
            canonical: "/posts",
            languages: {
            "en-US": "/en-US",
            "fr-CA": "/fr-CA"
            }
        },
        openGraph: {
            title: "Posts",
            description: descsJoin,
            url: postUrl,
            images:newImages
      }
      }
      // const newAuths = authors.concat(getAuths)
    }
    static async generateSingleMetadata({params}:Props,parent:ResolvingMetadata){
      const {id}=params;
      const getBlog= await Meta.getBlog(parseInt(id)) as unknown as blogType;
      const referrer = (await parent).referrer;
      const previousImages = (await parent)?.openGraph?.images || []
      const prevDesc = (await parent).openGraph?.description;
      const keywords = (await parent).keywords || [];
      const authors = (await parent).authors || [];
  
      const {name,desc,img,user_id,title}=getBlog;
      const {author,image_,bio}=await Meta.getUser(user_id as string);
     
      const blogUrl = `/blog/${id}`;
      const descsJoin=[prevDesc,bio,desc].join(", ");
      keywords.push(name as string);
      authors.push(author);
      previousImages.push(img as string);
      previousImages.push(image_);

      // const newAuths = authors.concat(getAuths)
      return {
        title:title,
          description: descsJoin,
          keywords: keywords,
          authors:authors,
          referrer,

          openGraph: {
              images: previousImages,
              description: descsJoin,
              url: blogUrl,
          },
      }
    }
    
    static async genSitemapArray():Promise<MetadataRoute.Sitemap>{
      let arr:MetadataRoute.Sitemap=[];
      try {
        arr=[
          {url:`${DOMAIN}`,lastModified:new Date(),changeFrequency:'weekly',priority:1},
          {url:`${DOMAIN}/blogs`,lastModified:new Date(),changeFrequency:'daily',priority:1},
          {url:`${DOMAIN}/posts`,lastModified:new Date(),changeFrequency:'daily',priority:1},
          {url:`${DOMAIN}/editor`,lastModified:new Date(),changeFrequency:'weekly',priority:1},
          {url:`${DOMAIN}/policy`,lastModified:new Date(),changeFrequency:'monthly',priority:1},
          {url:`${DOMAIN}/register`,lastModified:new Date(),changeFrequency:'yearly',priority:1},
          {url:`${DOMAIN}/termsOfService`,lastModified:new Date(),changeFrequency:'yearly',priority:1},
          {url:`${DOMAIN}/signin`,lastModified:new Date(),changeFrequency:'yearly',priority:1},
          {url:`${DOMAIN}/chart`,lastModified:new Date(),changeFrequency:'monthly',priority:1},
        ];
        const getBlogs= await prisma.blog.findMany({
          where:{
            show:true
          }
        });
        if(getBlogs && getBlogs.length>0){
          getBlogs.map(blog=>{
            arr.push({url:`${DOMAIN}/blog/${blog.id}`,lastModified:new Date(),changeFrequency:'always',priority:1})
          });
        }
      } catch (error) {
        const msg=getErrorMessage(error)
        console.log(msg);
        
      }finally{
        await prisma.$disconnect();
        return arr;
      }

    }
    static async genPosts():Promise<postType[]>{
      const posts=await prisma.post.findMany() as unknown[] as postType[];
      await prisma.$disconnect();
     return posts
    }
    static async genPost({params}:{params:{id:string}}):Promise<postType|undefined>{
      const id=Number(params.id);
      const post=await prisma.post.findUnique({
        where:{id:id}
       }) as unknown as postType|undefined;
       await prisma.$disconnect();
     return post
    }
}
export default Meta;


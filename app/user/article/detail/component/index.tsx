'use client'

// ******** Imports ********
import HeaderComponent from "@/components/header/header";
import logoImageUrl from "../../../../../assets/logo.png";
import logoFooterImageUrl from "../../../../../assets/image.png";
import { useEffect, useState } from "react";
import { Article, Articles, UserProfile } from "@/types/types-and-interface";
import { getAllArticles, getArticleById, getUserProfile } from "@/service/admin-service/admin-service";
import FooterComponent from "@/components/footer";
import { useRouter, useSearchParams } from "next/navigation";

// ******** Component Declaration ********
function AticleDetailComponent() {
  // ******** Local component state declaration ********
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [dataFromParamId ,setDataFromParamId] = useState<string>()
  const [dataArticle, setDataArticle] = useState<Article>();
  const [relatedArticles, setRelatedArticles] = useState<Article[]>();

  // ******** Local component variable declaration ********
  const searchParams = useSearchParams();
  const articleId = searchParams.get("articleId");
  const router = useRouter();

  /**
   * feth data id article form param
   */
  useEffect(() => {
    if (articleId) {
      setDataFromParamId(articleId);
    }
  }, [articleId]);
    
  /**
   * get one article for detail
   */
  useEffect(() => {
    if (!dataFromParamId) return;
    
    const getOneArticle = async () => {
      const res = await getArticleById(dataFromParamId);
      if (res) {
        setDataArticle(res?.data[0]);
      }
    };
    
    getOneArticle();
  }, [dataFromParamId]);

  /**
   * Get user profile to display in the header component
   */
  useEffect(() => {
    const fetchUserProfile = async () => {
      const data = await getUserProfile();
      setUserProfile(data);
    };

    fetchUserProfile();
  }, []);

  /**
   * get related article but just get 10 and filter 3 to render in UI
   */
  useEffect(() => {
    if (!dataArticle?.categoryId) return;
  
    const fetchRelatedArticles = async () => {
      try {
        const allArticles: Articles = await getAllArticles('', 1, 10, dataArticle.categoryId);

        const filtered = allArticles?.data
          ?.filter(
            (article) =>
              article?.categoryId === dataArticle?.categoryId && 
              article?.id !== dataArticle?.id, 
          )
          .slice(0, 3);
  
        setRelatedArticles(filtered);
      } catch (e) {
        throw e;
      }
    };
  
    fetchRelatedArticles();
  }, [dataArticle]);


  /**
   * Function to formated date ,the date just change in the display
   * @example - "2025-05-06T15:40:45.399Z" to "May 02, 2025"
   */
  function formatDate(dateString: string): string {
    if (!dateString) return '';

    // convert date to Date because send from called is string
    const date = new Date(dateString);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // structure the time base on day month and year
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // then re structure match with dev need
    return `${month} ${day}, ${year}`;
  }

  /**
   * handle when user click in teh related article
   */
  const handleClickRelated = (articleId: string) => {
    router.push(`/user/article/detail?articleId=${articleId}`);
  };
  
  return (
    <div className="w-full bg-white">
      {/* Header component */}
      <HeaderComponent
        style="w-full bg-[#F9FAFB] fixed h-[68px] flex justify-between items-center px-16 max-[500px]:px-5 border-b border-b-[#E2E8F0]"
        wraperProfileStyle="flex gap-1 items-center"
        imgStyle="bg-[#BFDBFE] flex justify-center font-semibold text-[#1E3A8A] items-center rounded-full h-[32px] w-[32px]"
        titleStyle="font-bold text-lg"
        profileTextStyle="underline font-semibold max-[500px]:hidden text-sm cursor-pointer"
        logoUrl={logoImageUrl?.src}
        logoStyle="w-[7rem]"
        profileText={userProfile?.username}
        logoClickable={true}
        logoRedirectTo="/user/article"
        dropdown="yes"
      />

      {/* Main component */}
      <div className="w-full min-h-screen px-[160px] max-[800px]:px-[100px] max-[700px]:px-[80px] max-[600px]:px-[60px] max-[500px]:px-[25px] pt-[68px]">
        {/* main content */}
        <div className="w-full pt-[40px]">
          {/* Created section */}
          <div className="created w-full text-sm flex gap-5 justify-center text-[#475569]">
            <p>{formatDate(dataArticle?.createdAt ?? '')}</p>
            <ul>
              <li className="list-disc">{`Created by ${userProfile?.username}`}</li>
            </ul>
          </div>

          {/* title section */}
          <div className="title w-full flex justify-center">
            <div className="max-w-[642px] font-[600] text-[30px]">
              <h1 className="text-center text-[#0F172A]">{dataArticle?.title}</h1>
            </div>
          </div>

          {/* image section */}
          <div className="image w-full h-[480px] max-[500px]:h-[200px] my-4">
            <img className="w-full h-full rounded-[12px]" src={'https://www.linknet.id/files/photos/shares/article/cyber%20security.jpg'} />
          </div>

          {/*  content section */}
          <div className="content w-full" dangerouslySetInnerHTML={{ __html: dataArticle?.content ?? '' }}></div>
        </div>

        {/* suggested content */}
        <div className="w-full mt-12">
          <div className="mb-2">
            <h1 className="text-xl font-bold">Other articles</h1>
          </div>
          <div className={`w-full ${(relatedArticles?.length ?? 0) < 2 ? 'justify-start' : 'justify-center'} flex gap-10 flex-wrap`}>
            {relatedArticles?.map((el) => (
              <div
                key={el?.id}
                onClick={() => handleClickRelated(el?.id ?? '')}
                className="w-[30%] max-[1100px]:w-[40%] max-[900px]:w-[45%] max-[750px]:w-[90%]"
              >
                <div>
                  <img
                    className="w-full h-[240px] cursor-pointer max-[1100px]:h-[190px] max-[900px]:h-[170px] max-[750px]:h-[220px] rounded-[12px]"
                    src={el?.imageUrl}
                    alt="related article with same category"
                  />
                </div>
                <div className="text-[#475569] my-2 text-sm">{formatDate(el?.createdAt ?? '')}</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0F172A]">{el?.title}</h3>
                  <p className="text-[#475569] my-2 text-ellipsis line-clamp-2" dangerouslySetInnerHTML={{ __html: el?.content ?? '' }}></p>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="bg-[#BFDBFE] rounded-full px-[12px] py-[4px] text-[#1E3A8A] text-sm">{el?.category?.name}</span>
                  <span className="bg-[#BFDBFE] rounded-full px-[12px] py-[4px] text-[#1E3A8A] text-sm">design</span>
                </div>
              </div>
            ))}

            {relatedArticles?.length === 0 && (
              <p className={`block text-center font-extrabold opacity-50`}>No data found !</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer component */}
      <FooterComponent
        style="w-full bg-[#2563EBDB] mt-8 min-h-[68px] max-[555px]:gap-0 max-[555px]:py-3 flex max-[555px]:flex-col justify-center gap-4 items-center px-16 max-[500px]:px-5"
        wraperProfileStyle="flex gap-1 items-center"
        titleStyle="font-bold text-lg"
        profileTextStyle="underline font-semibold text-sm cursor-pointer"
        logoUrl={logoFooterImageUrl?.src}
        logoStyle="w-[7rem]"
        imgStyle="text-white "
        profileText="© 2025 Blog genzet. All rights reserved."
      />
    </div>
  );
}

export default AticleDetailComponent;
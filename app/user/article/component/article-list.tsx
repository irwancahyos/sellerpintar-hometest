// ******** Imports ********
import { Articles } from "@/types/types-and-interface";
import { useRouter } from 'next/navigation';
import imageTemporary from '../../../../assets/cyber security.jpg';

// ******** Local Interace ********
interface ArticleList {
  articles?: Articles 
  isLoading?: boolean
}

// ******** Component Declaration ********
function ArticleList({articles, isLoading = false}: ArticleList) {

  // ******** Local component variable declaration ********
  const router = useRouter();

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
   * Function when open detail article
   */
  const handleOpenDetailArticle = (id: string) => {
    router.push(
      `article/detail/?articleId=${id}`,
    );
  }

  return (
    <div className="w-full px-[10vh] max-[500px]:px-8 mt-10">
      {/* Show result section */}
      <div className="w-full my-4">
        <p className="text-[#475569]">{`Showing : ${articles?.limit} of ${articles?.total} articles`}</p>
      </div>

      {!isLoading && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-5">
          {/* Card 1 */}
          {articles?.data?.map((el) => (
            <div key={el?.id} className="h-full">
              <div>
                <img
                  onClick={() => handleOpenDetailArticle(el?.id ?? '')}
                  className="w-full hover:opacity-70 cursor-pointer h-[240px] max-[1100px]:h-[190px] max-[900px]:h-[170px] max-[750px]:h-[250px] rounded-[12px]"
                  src={`${el?.imageUrl}`}
                  alt="image of article"
                />
              </div>
              <div className="text-[#475569] my-2 text-sm">{formatDate(el?.createdAt ?? '')}</div>
              <div>
                <h3 className="text-lg font-semibold text-[#0F172A]">{el?.title}</h3>
                <p className="text-[#475569] my-2 text-ellipsis line-clamp-2" dangerouslySetInnerHTML={{ __html: el?.content || '' }}></p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="bg-[#BFDBFE] rounded-full px-[12px] py-[4px] text-[#1E3A8A] text-sm">{el?.category?.name}</span>
                <span className="bg-[#BFDBFE] rounded-full px-[12px] py-[4px] text-[#1E3A8A] text-sm">design</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* loading indicator */}
      {isLoading && (
        <div className="w-full justify-center flex pb-6">
          <svg
            className="animate-spin -ml-1 mr-3 h-20 w-20 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              strokeLinecap="round"
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}

// ******** Export Declaration ********
export default ArticleList;
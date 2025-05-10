'use client'

// ******** Imports ********
import GeneralButton from '@/components/button/general-button';
import InputTypeText from '@/components/input/input-text';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PlusIcon, SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { deleteArticle, getAllArticles, getAllCategory } from '@/service/admin-service/admin-service';
import { Article, Articles, Category, Categorys } from '@/types/types-and-interface';
import { useRouter } from 'next/navigation';
import { AlertDialogCategory } from '@/components/alert-popup/alert-popup';


// ******** Component Declaration ********
function ArticleComponent() {
  // ******** Local component state declaration ********
  const [articles, setArticles] = useState<Articles>();
  const [categorys, setCategorys] = useState<Categorys[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [searchArticle, setSearchArticle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [swetAlert, setSwetAlert] = useState({
    open: false,
    title: '',
    description: '',
    firstButtonText: '',
    secondButtonText: '',
    responValue: '',
    id: '',
  });

  // ******** Local ccomponent variable declaration ********
  const limit = 10;
  const debouncedSearchQuery: string = useDebounce(searchArticle, 300);
  const router = useRouter();

  // ******** React hooks useEffect declaration ********
  useEffect(() => {
    fetchArticles();
  }, [debouncedSearchQuery, categoryId, page]);


  /**
   * Fetch data all article with send payload and return 10 data
   * @debouncedSearchQuery - string
   * @page - number
   * @limit - number
   * @categoryId - string
   */
  async function fetchArticles() {
    setIsLoading(true);
    try {
      const data: Articles = await getAllArticles(debouncedSearchQuery, page, limit, categoryId);

      // re assign articles and data count
      setArticles(data);
      setDataCount(data?.data?.length ?? 0);
    } catch (e) {
      throw new Error(`Error when get data article from component: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch data all category , use while to get all data because without send payload just get 10 data
   * purpose to fill dropdown filter category by id
   * @page - number
   * @limit - number
   */
  useEffect(() => {
    async function fetchAllCategory() {
      setIsLoading(true);

      try {
        let allDataCategory: Category[] = [];
        let page = 1;
        const limit = 10;

        while (true) {
          const res = await getAllCategory(page, limit);
          allDataCategory = [...allDataCategory, ...res.data];

          // the looping will stop when get current page same with total page, mean the data is unavailable
          if (res?.currentPage === res?.totalPages) break;
          page++;
        }

        setCategorys(allDataCategory);
        uniqCategory(allDataCategory);
      } catch (e) {
        throw new Error(`Error when get data category from component: ${e}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllCategory();
  }, []);

  // ******** Function declaration ********

  /**
   * Function to make the search not directly search instead wait for 300ms after user fill the input
   */
  function useDebounce(value: string, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  /**
   * Function to structure data dropdown of category
   * @return - return variable {id: id of category, name: name of category}
   */
  const uniqCategory = (category: Category[]): void => {
    const uniqCategory = [
      ...new Set(
        category
          .filter((el) => el?.name)
          .map((el) => {
            return {
              name: el?.name,
              id: el?.id,
            };
          }),
      ),
    ];

    setCategorys(uniqCategory);
  };

  /**
   * Function to set when category selected by user and make the pagination back to 1
   */
  const handleCategorySelected = (id: string) => {
    setPage(1);
    id === 'All' ? setCategoryId('') : setCategoryId(id);
  };

  /**
   * Function to handle when close alert category to know the respon value and when respon from confirmation is true then delete data category
   */
  const onDialogCloseRespon = async (responValue?: true | false) => {
    setSwetAlert((prev) => ({ ...prev, open: false }));
    if (responValue) {
      try {
        const res = await deleteArticle(swetAlert?.id);
        
        if(res) {
          fetchArticles();
        }
      } catch (e) {
        throw new Error(`Error when try to delete article: ${e}`);
      }
    }
  };

  /**
   * Function to set when field search text change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchArticle(e?.target?.value);
  };

  /**
   * Function to formated date ,the date just change in the display
   * @example - "2025-05-06T15:40:45.399Z" to "May 02, 2025 18:52:28"
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

    // structure time base on seconds minutes and hours
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // then re structure match with dev need
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Function to create new article
   */
  const handleAddArticle = () => {
    window.location.href = 'article/form';
  };

  /**
   * Function to edit article
   */
  const handleClick = (article: Article) => {
    sessionStorage.setItem('temporaryContentPreview', article?.content ?? '');
    router.push(
      `article/form?articleId=${article?.id}&imageUrl=${article?.imageUrl}&title=${article?.title}&categoryName=${article?.category?.name}&categoryId=${article?.categoryId}`
    );
  };


  /**
   * Function to delete article
   */
  const handleDeleteArticle = async (articleId: string) => {
    setSwetAlert(prev => ({...prev, open: true, title: "Delete Articles", id: articleId, description: `Deleting this article is permanent and cannot be undone. All related content will be removed.`}));
  };

  /**
   * Handle when swal is closed
   */
  const handleCloseAlert = () => {
    setSwetAlert(prev => ({...prev, open: false}));
  }

  /**
   * Handle next page in paginatir
   */
  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  /**
   * Handle prev page in paginatir
   */
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };


  /**
   * Function to open preview article
   */
  const openPreview = (article: Article) => {
    sessionStorage.setItem('temporaryContentPreview', article?.content ?? '');
    router.push(
      `/preview?articleId=${article?.id}&imageUrl=${article?.imageUrl}&title=${article?.title}&categoryName=${article?.category?.name}&categoryId=${article?.categoryId}&createAd=${article?.createdAt}`,
    );
  }

  /**
   * Function handle pagination to make the pagination is dinamicly
   */
  function getPageList(currentPage: number, totalPages: number) {
    const delta = 1; // how many pages to show on each side of current
    const range: number[] = [];
    const rangeWithDots: (number | '...')[] = [];

    // build full range [1,2,3…totalPages]
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    // now inject '...' where gaps exist
    let prev: number | null = null;
    for (const page of range) {
      if (prev !== null) {
        if (page - prev! > 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  }

  return (
    <div className="w-full">
      {/* header total and search */}
      <div className="w-full">
        {/* Total Articles */}
        <div className="total bg-[#F9FAFB] rounded-t-[12px] p-[24px] border border-[#E2E8F0] gap-0.5 flex border-b-0">
          <p>Total Articles</p>
          <span>:</span>
          <p className={`${isLoading ? 'pt-[3px]' : 'pt-0'}`}>
            {!isLoading ? (
              articles?.total
            ) : (
              <span>
                <svg
                  className="animate-spin mr-3 h-5 w-5 text-neutral-200"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </p>
        </div>

        {/* Search, filter and button add article */}
        <div className="search p-[24px] bg-[#F9FAFB] border border-[#E2E8F0] flex justify-between">
          <div className="flex gap-2">
            {/* Dropdown category */}
            <Select onValueChange={(value) => handleCategorySelected(value)}>
              <SelectTrigger className="w-[109px] cursor-pointer">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="!max-h-[20rem]">
                <SelectItem className="cursor-pointer" value="All">
                  All
                </SelectItem>
                {categorys
                  ?.filter((category): category is Category => !!category?.id)
                  .map((category) => (
                    <SelectItem key={category.id} className="cursor-pointer" value={category?.id ?? ''}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {/* Search by title */}
            <InputTypeText
              placeholder="Search by title"
              inputStyle="focus:outline-none w-full h-[2rem] text-sm p-[0.4rem]"
              inputStyleFromComponent="flex items-center border-1 min-w-[240px] p-[0.1rem] rounded-md focus:outline"
              type="text"
              value={searchArticle}
              onChange={handleSearchChange}
              suffixIcon={<SearchIcon size={16} className="ml-1 opacity-40" />}
            />
          </div>

          {/* Button create article */}
          <div>
            <GeneralButton
              onClick={handleAddArticle}
              styles="bg-[#2563EB] cursor-pointer rounded-sm w-full text-white text-sm px-2 py-[0.45rem] flex items-center gap-1"
              text="Add Articles"
              img={<PlusIcon size={16} />}
            />
          </div>
        </div>

        {/* table start */}
        {!isLoading && (
          <div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow className="border border-[#E2E8F0] border-t-0 border-b-0">
                    <TableHead className="text-center text-[#0F172A]">Thumbnails</TableHead>
                    <TableHead className="text-center text-[#0F172A]">Title</TableHead>
                    <TableHead className="text-center text-[#0F172A]">Category</TableHead>
                    <TableHead className="text-center text-[#0F172A]">Created at</TableHead>
                    <TableHead className="text-center text-[#0F172A]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-[#F9FAFB] border-[#E2E8F0] border-l border-r">
                  {articles?.data?.map((el: Article) => (
                    <TableRow key={el?.id}>
                      <TableCell className="text-center">
                        <img className="w-10 h-10 rounded-sm m-auto" src={el?.imageUrl} />
                      </TableCell>
                      <TableCell className="max-w-[140px] break-words whitespace-normal text-[#475569]">{el?.title}</TableCell>
                      <TableCell className="text-center text-[#475569]">{el?.category?.name}</TableCell>
                      <TableCell className="text-center text-[#475569]">{formatDate(el?.createdAt ?? '')}</TableCell>
                      <TableCell className="text-[#475569] underline">
                        <div className="w-full h-full flex justify-center gap-1.5">
                          <p onClick={() => openPreview(el)} className="text-[#2563EB] cursor-pointer">
                            Preview
                          </p>
                          <p onClick={() => handleClick(el)} className="text-[#2563EB] cursor-pointer">
                            Edit
                          </p>
                          <p onClick={() => handleDeleteArticle(el?.id ?? '')} className="text-[#EF4444] cursor-pointer">
                            Delete
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* pagination */}
            <div className="rounded-b-[12px] border-[#E2E8F0] border p-[24px] bg-[#F9FAFB]">
              <Pagination className={dataCount === 0 ? 'invisible' : 'visible'}>
                <PaginationContent>
                  <PaginationItem
                    className={`${
                      (articles?.limit ?? 0) * (articles?.page ?? 0) < (articles?.total ?? 0)
                        ? 'opacity-40 pointer-events-none'
                        : 'opacity-100 cursor-pointer pointer-events-auto'
                    }`}
                  >
                    <button onClick={handlePrev}>
                      <PaginationPrevious />
                    </button>
                  </PaginationItem>

                  {/* Dynamic pages + ellipsis */}
                  {getPageList(articles?.page ?? 0, Math.ceil((articles?.total ?? 0) / (articles?.limit ?? 0)) ?? 0).map((item, idx) => {
                    if (item === '...') {
                      return (
                        <PaginationItem key={`dot-${idx}`} className="relative mx-2">
                          <PaginationEllipsis className="absolute -top-3 -left-4" />
                        </PaginationItem>
                      );
                    } else {
                      return (
                        <PaginationItem key={item}>
                          <PaginationLink
                            href="#"
                            isActive={item === articles?.page}
                            onClick={() => setPage(item)}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  })}

                  <PaginationItem
                    className={`relative ml-1.5 mr-8 ${
                      (articles?.limit ?? 0) * (articles?.page ?? 0) >= (articles?.total ?? 0)
                        ? 'opacity-40 pointer-events-none'
                        : 'opacity-100 cursor-pointer pointer-events-auto'
                    }`}
                  >
                    <button onClick={handleNext}>
                      <PaginationNext className="cursor-pointer" />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              {/* No Data Show */}
              <h1 className={dataCount === 0 ? 'block text-center font-extrabold opacity-50' : 'hidden'}>No data found !</h1>
            </div>
          </div>
        )}

        {/* loading indicator */}
        {isLoading && (
          <div className="w-full flex justify-center bg-[#F9FAFB] border-[#E2E8F0] border border-t-0 rounded-b-[12px] items-center p-[24px]">
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

      {/* Alertt calling */}
      <AlertDialogCategory
        open={swetAlert?.open}
        description={swetAlert?.description}
        title={swetAlert?.title}
        onDialogClose={onDialogCloseRespon}
        onClose={handleCloseAlert}
      />
    </div>
  );
}

// ******** Export Declaration ********
export default ArticleComponent;

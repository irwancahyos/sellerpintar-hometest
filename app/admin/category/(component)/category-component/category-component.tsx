'use client'

// ******** Imports ********
import { useEffect, useState } from "react";
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
import GeneralButton from "@/components/button/general-button";
import InputTypeText from "@/components/input/input-text";
import { deleteCategory, getAllCategory } from "@/service/admin-service/admin-service";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Category, Categorys } from "@/types/types-and-interface";
import DialogCategoryForm from "../form/dialog-category/category-dialog";
import { AlertDialogCategory } from "@/components/alert-popup/alert-popup";

// ******** Component declaration ********
function CategotryComponent() {
  // ******** Local component state declaration ********
  const [isLoading, setIsLoading] = useState(false);
  const [categorys, setCategorys] = useState<Categorys>();
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const [searchCategory, setSearchCategory] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<Category|undefined>(undefined);
  const [swetAlert, setSwetAlert] = useState({open: false, title: "", description: "", firstButtonText: "", secondButtonText: "", responValue: "", id: "" });


  // ******** Local ccomponent variable declaration ********
  const limit = 10;
  const debouncedSearchQuery: string = useDebounce(searchCategory, 300);

  // ******** React hooks ********
  useEffect(() => {
    fetchAllCategory();
  }, [debouncedSearchQuery, page]);

  /**
   * Fetch data all category , use while to get all data because without send payload just get 10 data
   * purpose to fill dropdown filter category by id
   * @page - number
   * @limit - number
   */
  async function fetchAllCategory() {
    setIsLoading(true);

    try {
      const res: Categorys = await getAllCategory(page, limit, debouncedSearchQuery);
      setCategorys(res);
      setDataCount(res?.data?.length ?? 0);
    } catch (e) {
      throw new Error(`Error when get data category from component: ${e}`);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Function to set when field search text change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCategory(e?.target?.value);
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

  /**
   * Function will calling when dialog calling
   * it will send data of category per row, but when calling from add category it will send undefined
   */
  const handleCallingDialog = (dataEdit?: Category) => {
    if(dataEdit) {
      setDataEdit(dataEdit);
    }
    setIsDialogOpen(true);
  }

  /**
   * Function calling when user close dialog from edit or add category
   * It will set open dialog to false and also make the variable data edit undefined ,means like clearValue
   */
  const handleCloseDialog = (reason?: 'cancel' | 'submit') => {
    setIsDialogOpen(false);

    // if the reason callback from children is submit then call fetch category
    if (reason === 'submit') {
      fetchAllCategory()
    }
    
    setTimeout(() => {
      setDataEdit(undefined);
    }, 500)
  };

  /**
   * Function to open the alert category, so set the state category with below value
   */
  const handlDeleteCategory = (id: string, name: string) => {
    setSwetAlert(prev => ({...prev, open: true, title: "Delete Category", id: id, description: `Delete category “${name}”? This will remove it from master data permanently. `}));
  }

  /**
   * Function to handle when close alert category to know the respon value and when respon from confirmation is true then delete data category
   */
  const onDialogCloseRespon = async (responValue?: true | false) => {
    setSwetAlert(prev => ({ ...prev, open: false }));
    if(responValue) {
      try {
        const res = await deleteCategory(swetAlert?.id);

        if(res) {
          fetchAllCategory()
        }
      } catch(e) {
        throw new Error(`Error when try to delete category: ${e}`)
      }
    }
  }

  const handleCloseAlert = () => {
    setSwetAlert(prev => ({...prev, open: false}));
  }

  return (
    <div className="w-full">
      {/* Total Articles */}
      <div className="total bg-[#F9FAFB] rounded-t-[12px] p-[24px] border border-[#E2E8F0] gap-0.5 flex border-b-0">
        <p>Total Articles</p>
        <span>:</span>
        <p className={`${isLoading ? 'pt-[3px]' : 'pt-0'}`}>
          {!isLoading ? (
            categorys?.totalData
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
          {/* Search by title */}
          <InputTypeText
            placeholder="Search category"
            inputStyle="focus:outline-none w-full h-[2rem] text-sm p-[0.4rem]"
            inputStyleFromComponent="flex items-center border-1 min-w-[240px] p-[0.1rem] rounded-md focus:outline"
            type="text"
            value={searchCategory}
            onChange={handleSearchChange}
            suffixIcon={<SearchIcon size={16} className="ml-1 opacity-40" />}
          />
        </div>

        {/* Button create article */}
        <div>
          <GeneralButton
            styles="bg-[#2563EB] hover:opacity-80 cursor-pointer rounded-sm w-full text-white text-sm px-2 py-[0.45rem] flex items-center gap-1"
            text="Add Articles"
            onClick={() => handleCallingDialog()}
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
                <TableRow className="border border-[#E2E8F0] border-t-0 border-b-0 h-[60px]">
                  <TableHead className="text-center text-[#0F172A] w-[33%]">Category</TableHead>
                  <TableHead className="text-center text-[#0F172A] w-[34%]">Created at</TableHead>
                  <TableHead className="text-center text-[#0F172A] w-[33%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-[#F9FAFB] border-[#E2E8F0] border-l border-r">
                {categorys?.data?.map((el: Category) => (
                  <TableRow className="h-[60px]" key={el?.id}>
                    <TableCell className="text-center whitespace-normal text-[#475569]">{el?.name}</TableCell>
                    <TableCell className="text-center text-[#475569]">{formatDate(el?.createdAt ?? '')}</TableCell>
                    <TableCell className="text-[#475569] underline">
                      <div className="w-full h-full flex justify-center gap-1.5">
                        <p onClick={() => handleCallingDialog(el)} className="text-[#2563EB] cursor-pointer">Edit</p>
                        <p onClick={() => handlDeleteCategory(el?.id ?? '', el?.name ?? '')} className="text-[#EF4444] cursor-pointer">Delete</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* pagination */}
          <div className="rounded-b-[12px] border-[#E2E8F0] border p-[24px] bg-[#F9FAFB]">
            <Pagination className={dataCount === 0 ? 'hidden' : ''}>
              <PaginationContent>
                <PaginationItem
                  className={`${
                    categorys?.currentPage === 1 ? 'opacity-40 pointer-events-none' : 'opacity-100 cursor-pointer pointer-events-auto'
                  }`}
                >
                  <button className="cursor-pointer" onClick={handlePrev}>
                    <PaginationPrevious />
                  </button>
                </PaginationItem>
                {/* Dynamic pages + ellipsis */}
                {getPageList(categorys?.currentPage ?? 0, categorys?.totalPages ?? 0).map((item, idx) => {
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
                          isActive={item === categorys?.currentPage}
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
                    categorys?.currentPage === categorys?.totalPages
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

      {/* Call dialog */}
      <AlertDialogCategory open={swetAlert?.open} description={swetAlert?.description} title={swetAlert?.title} onDialogClose={onDialogCloseRespon} onClose={handleCloseAlert} />
      <DialogCategoryForm dataEdit={dataEdit} onDialogClose={handleCloseDialog} open={isDialogOpen} title={dataEdit ? 'Edit Category' : 'Add Category'} onOpenChange={(open) => open ? setIsDialogOpen(true) : handleCloseDialog()}/>
    </div>
  );
}

// ******** Export declaration ********
export default CategotryComponent;
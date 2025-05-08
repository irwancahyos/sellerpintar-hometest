  'use client'

  // ******** Imports ********
  import GeneralButton from '@/components/button/general-button';
  import InputTypeText from '@/components/input/input-text';
  import { getAllCategory, uploadImage } from '@/service/admin-service/admin-service';
  import { ArrowLeft, ImagePlus } from 'lucide-react';
  import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

  // ******** Component Declaration ********
  function ArticleForm() {
    // ******** Local state variable declaration ********
    const [imageUrl, setImageUrl] = useState<string>('');
    const [categorys, setCategorys] = useState<any[]>([]);
    
    // ******** Local component variable declaration ********
    const fileInputRef = useRef<HTMLInputElement | null>(null);


      /**
       * Fetch data all category , use while to get all data because without send payload just get 10 data
       * purpose to fill dropdown filter category by id
       * @page - number
       * @limit - number
       */
      useEffect(() => {
        async function fetchAllCategory() {
    
          try {
            let allDataCategory: any[] = [];
            let page = 1;
            let limit = 10;
            let total = 0;
    
            while (true) {
              const res = await getAllCategory(page, limit);
              allDataCategory = [...allDataCategory, ...res.data];
              total = res.total;
    
              // the looping will stop when get current page same with total page, mean the data is unavailable
              if (res?.currentPage === res?.totalPages) break;
              page++;
            }
    
            setCategorys(allDataCategory);
            uniqCategory(allDataCategory);
          } catch (e) {
            throw new Error(`Error when get data category from component: ${e}`);
          }
        }
    
        fetchAllCategory();
      }, []);

      /**
   * Function to structure data dropdown of category
   * @return - return variable {id: id of category, name: name of category}
   */
  const uniqCategory = (category: any[]): void => {
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

    const handleClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      if(!file) return;

      try {
        const resUrl = await uploadImage(file);
        setImageUrl(resUrl);
      } catch(e) {
        throw new Error(`Error when upload image in component: ${e}`);
      } 
      };

      const handleCategorySelected = (id: string) => {

      }
    
    return (
      <div className="w-full min-h-[84vh]">
        {/* Button back and title section  */}
        <div className="bg-[#F9FAFB] p-[24px] border-[#E2E8F0] border rounded-t-[12px] flex items-center gap-2">
          <div>
            <GeneralButton styles="w-dit cursor-pointer h-full flex items-center" img={<ArrowLeft className="w-[20px] h-[20px]" />} />
          </div>
          <div>
            <p className="font-semibold">Create Articles</p>
          </div>
        </div>

        {/* Form section  */}
        <form className="w-full bg-[#F9FAFB] p-[24px] border-[#E2E8F0] border-x">
          <div className="w-full">
            <p className="mb-1 font-semibold">Thumbnails</p>

            {/* Box input section  */}
            <div className="w-[223px] h-[163px]">
              {/* input file but hidden the display */}
              <input type="file" accept=".jpg,.jpeg,.png" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

              {/* when image url exist so render the image instead render choose image */}
              {imageUrl ? (
                <div className="rounded-[12px] min-w-full min-h-full bg-[#FFFFFF] flex flex-col items-center border border-[#CBD5E1]">
                  <img src={imageUrl} alt="Uploaded Image" className="w-[199px] mt-2.5 rounded-[6px] h-[115px] object-cover" />
                  <div className="w-full justify-center h-[16px] mt-1.5 flex gap-2">
                    <button onClick={handleClick} className="text-[#2563EB] cursor-pointer border-b border-b-[#2563EB] pb-4 text-sm">
                      Changes
                    </button>
                    <button
                      onClick={() => setImageUrl('')}
                      className="text-[#EF4444] cursor-pointer border-b border-b-[#EF4444] pb-4 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="h-full rounded-[12px] w-full bg-[#FFFFFF] border-dashed border border-[#CBD5E1] cursor-pointer flex flex-col justify-center items-center text-center p-[12px] hover:opacity-70 relative"
                  onClick={handleClick}
                >
                  <ImagePlus className="w-[20px] text-[#64748B] h-[20px] mb-2" />
                  <div className="text-[#64748B] text-sm">
                    <p className="border-b-[0.01rem] border-[#64748bab] inline-block">Click to select files</p>
                    <p>Support File Type: jpg or png</p>
                  </div>
                </div>
              )}
            </div>

            {/* Title input section  */}
            <div className="w-full mt-4">
              <p className="font-semibold mb-1">Title</p>
              <InputTypeText
                placeholder="Input title"
                inputStyle="focus:outline-none w-full h-[2.2rem] text-sm p-[0.4rem]"
                inputStyleFromComponent="flex items-center border min-w-full p-[0.1rem] bg-[#FFFFFF] border-[#E2E8F0] rounded-md focus:outline"
              />
            </div>

            {/* Title select section  */}
            <div className="w-full mt-4">
              <p className="font-semibold mb-1">Category</p>
              <Select onValueChange={(value) => handleCategorySelected(value)}>
                <SelectTrigger className="w-full bg-[#FFFFFF] border-[#E2E8F0] border cursor-pointer">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="!max-h-[20rem]">
                  {categorys?.map((category) => (
                    <SelectItem key={category?.id} className="cursor-pointer" value={category?.id}>
                      {category?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-[#64748B] mt-0.5">The existing category list can be seen in the {' '}<span className="text-[#2563EB]"><a href="#">category</a></span>{' '}menu</p>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ******** export Declaration ********
  export default ArticleForm;

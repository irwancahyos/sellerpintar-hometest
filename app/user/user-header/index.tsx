// ******** Imports ********
import { Category } from '@/types/types-and-interface';
import headerBgImage from '../../../assets/user-asset/header-image.jpg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UniqCategory } from '../article/page';
import InputTypeText from '@/components/input/input-text';
import { useState } from 'react';
import { SearchIcon } from 'lucide-react';

// ******** Local interface ********
interface UserHeader {
  categorys?: UniqCategory[];
  onSearchChange: (value: string) => void;
  onCategorySelected: (id: string) => void;
}

// ******** Component Declaration ********
function UserHeader({categorys, onCategorySelected, onSearchChange}: UserHeader) {

  // ******** Local component state declaration ********
  const [searchArticle, setSearchArticle] = useState('');

  /**
   * function send event to parent when user filter by category or search by article
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchArticle(e.target.value);
    onSearchChange(e?.target?.value);
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${headerBgImage?.src})` }}
        className={`w-full max-[500px]:min-h-[650px] min-h-[450px] max-[640px]:min-h-[600px] bg-cover bg-no-repeat bg-center relative z-10 flex justify-center max-[350px]:items-start items-center`}
      >
        {/* Overlay Blue */}
        <div className="bg-[#2563EBDB] max-[500px]:min-h-[650px] max-[640px]:min-h-[600px] inset-0 absolute opacity-[96%] min-h-[450px]"></div>

        {/* Main Content */}
        <div className="w-[730px] h-[276px] inset-0 relative z-20 max-[378px]:mt-3 max-[350px]:mt-28 mt-12">
          {/* Text Section */}
          <div className="text text-[#FFFFFF] w-full flex flex-col items-center gap-2">
            <h1 className="font-bold">Blog genzet</h1>
            <p className="text-5xl text-center">The Journal : Design Resources, Interviews, and Industry News</p>
            <p className="text-2xl text-center">Your daily dose of design insights!</p>
          </div>

          {/* Filter section */}
          <div className="input-filter w-full flex justify-center mt-8">
            <div className="p-2 bg-[#3B82F6] max-[640px]:flex-col rounded-[12px] w-[80%] max-w-[608px] flex gap-2">
              {/* Dropdown category */}
              <Select onValueChange={onCategorySelected}>
                <SelectTrigger className="min-w-[180px] max-[640px]:w-full cursor-pointer bg-white">
                  <SelectValue placeholder="Select Category" />
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
                placeholder="Search article"
                inputStyle="focus:outline-none w-full h-[2rem] text-sm p-[0.4rem]"
                inputStyleFromComponent="flex w-full items-center border-1 min-w-[240px] bg-white p-[0.1rem] rounded-md focus:outline"
                type="text"
                value={searchArticle}
                onChange={handleSearchInputChange}
                suffixIcon={<SearchIcon size={16} className="ml-1 opacity-40" />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserHeader;
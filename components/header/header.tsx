// ******** Imports ********
import { Header } from "@/types/types-and-interface";


// ******** Component Declaration ********
function HeaderComponent({style, title, wraperProfileStyle, imgStyle, profileTextStyle, wrapperTitleStyle, profileText, profilePict, titleStyle, logoUrl, logoStyle}: Header) {
  return ( 
    <>
      <header className={`${style}`}>
        <div className={`title ${wrapperTitleStyle}`}>
          {title && <h2 className={`title ${titleStyle}`}>{title}</h2>}
          {logoUrl && <img className={`${logoStyle}`} src={logoUrl} alt="this logo of header" />}
        </div>
        <div className={`${wraperProfileStyle} profile`}>
          <div className={`${imgStyle}`}>
            <p>{profileText?.substring(0,1).toUpperCase()}</p>
          </div>
          <p className={`${profileTextStyle}`}>{profileText}</p>
        </div>
      </header>
    </>
   );
}

// ******** Export Declaration ********
export default HeaderComponent;
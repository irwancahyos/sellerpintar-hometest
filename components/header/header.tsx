'use client'

// ******** Local Interface ********
interface Header {
  title?: string;
  profileText?: string;
  style?: string;
  wraperProfileStyle?: string;
  imgStyle?: string;
  profileTextStyle?: string; 
  wrapperTitleStyle?: string;
  titleStyle?: string;
  profilePict?: string;
}

// ******** Component Declaration ********
function HeaderComponent({style, title, wraperProfileStyle, imgStyle, profileTextStyle, wrapperTitleStyle, profileText, profilePict, titleStyle}: Header) {
  return ( 
    <>
      <header className={`${style}`}>
        <div className={`title ${wrapperTitleStyle}`}>
          <h2 className={`title ${titleStyle}`}>{title}</h2>
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
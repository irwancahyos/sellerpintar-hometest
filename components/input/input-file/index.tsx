  // ******** Imports ********

  interface InputTypeFIleInterface {
    isLabelOutside?: boolean;
    styleForInput?: string;
    styleForLabel?: string;
    styleForWrapper?: string;
    labelText?: string;
  }

  // ******** Component Declaration ********
  function InputTypeFile({isLabelOutside, styleForInput, styleForLabel, styleForWrapper, labelText }: InputTypeFIleInterface) {
    return ( 
      <>
        {isLabelOutside ? (
          <div className={`${styleForWrapper}`}>
            <label className={`${styleForLabel}`} htmlFor="input-file">{labelText}</label>
            <input className={`${styleForInput}`} name="input-file" type="file" />
          </div>
        ) : (
            <label className={`${styleForLabel} w-[50rem]`}>
              {labelText}
              <input className={`${styleForInput}`} type="file" />
            </label>
        )
        }
      </>
    );
  }

  export default InputTypeFile;
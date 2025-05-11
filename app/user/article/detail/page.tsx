

// ******** Export Declaration ********
import { Suspense } from "react";
import AticleDetailComponent from "./component/index";

// ******** Component Declaration ********
function ArticleDetail() {
  return ( 
    <Suspense fallback={<div>Loading...</div>}>
      <AticleDetailComponent />
    </Suspense>
  );
}

// ******** Export Declaration ********
export default ArticleDetail;
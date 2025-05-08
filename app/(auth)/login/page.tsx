// ******** Imports ********
import LoginComponent from "./component/login";

// ******** Component declaration ********
function Login() {
  return ( 
    <div className="bg-[#F3F4F6] max-[500px]:p-0 w-full min-h-screen flex justify-center items-center">
      <LoginComponent />
    </div>
   );
}

// ******** Export declaration ********
export default Login;
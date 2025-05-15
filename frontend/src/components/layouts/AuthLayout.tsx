import { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl h-full flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left side - Image and testimonial */}
        <div className="hidden md:block md:w-5/12 bg-gray-800 relative">
          {/* Background image (optional) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/api/placeholder/1000/1000')",
              opacity: 0.6,
            }}
          />

          {/* Image tag */}
          <img
            src="https://img.freepik.com/free-photo/handsome-businessman-working-office_158595-1191.jpg?ga=GA1.1.64500208.1747290668&semt=ais_hybrid&w=740"
            alt="Auth background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          {/* Logo */}
          <div className="absolute top-8 left-8 flex items-center z-10">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="w-8 mr-2 shrink-0" />
              <span className="text-white text-xl font-medium">Tracksy</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="absolute bottom-16 left-8 right-8 text-white z-10">
            <h2 className="text-2xl font-bold mb-6 leading-tight">
              "Tracksy makes managing tasks simple and efficient. It's my go-to
              tool for keeping everything on track—solo or with my team."
            </h2>
            <div>
              <p className="font-medium">Karen Yue</p>
              <p className="text-sm text-white/70">
                Director of Digital Marketing Technology
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form (scrollable) */}
        <div className="w-full md:w-7/12 bg-white h-full overflow-y-auto py-6 px-6 lg:px-12">
          <div className="max-w-md mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

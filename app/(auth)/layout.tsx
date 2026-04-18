export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-5 luli-gradient">
      {/* Left side — Image */}
      <div className="hidden md:block col-span-2 relative luli-grad ient">
        <img
          src="https://res.cloudinary.com/dgj2rhqd0/image/upload/luliops-logo-trans_eoxfjv.png"
          alt="Auth visual"
          className="absolute inset-0 h-full w-full object-contain"
        />
        {/* Optional overlay */}
        {/* <div className="absolute inset-0 bg-black/40" /> */}
      </div>

      {/* Right side — Form */}
      <div className="flex items-center col-span-3 justify-center px-4 b border-l-2 b order-[#270536]">
        <div className="w-full max-w-md rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  );
}

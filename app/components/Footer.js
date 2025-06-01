export default function Footer() {
    return (
      <footer className=" text-[#1A1A1A] py-6 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <p className="text-sm">&copy; {new Date().getFullYear()} Stampify. All rights reserved.</p>
          <nav className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </footer>
    );
  }
  

interface FooterProps {
    darkMode: boolean;
}
function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`bg-gray-800 ${darkMode ? 'dark:bg-gray-900' : ''} text-white py-4 px-6`}>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <p>© {new Date().getFullYear()} Mon Application. Tous droits réservés.</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-300">Mentions légales</a>
          <a href="#" className="hover:text-blue-300">Politique de confidentialité</a>
          <a href="#" className="hover:text-blue-300">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
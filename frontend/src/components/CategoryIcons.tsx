import {
    FaMobileAlt, FaCamera, FaDog, FaBaby,
    FaGlobeAsia, FaTools,
    FaLaptop, FaPrint,
    FaCrown,
    FaWallet,
    FaTshirt as FaTShirt, FaPalette as FaHome,
    FaImages, FaCreditCard, FaClock, FaCloudSun,
    FaPaw, FaBaby as FaBabyIcon, FaShoppingBag
} from 'react-icons/fa';

// CategoryIcon component - receives icon name string and returns the icon
export const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
    const icons: any = {
        FaMobileAlt: <FaMobileAlt className={className} />,
        FaCamera: <FaCamera className={className} />,
        FaTshirt: <FaTShirt className={className} />,
        FaCrown: <FaCrown className={className} />,
        FaCreditCard: <FaCreditCard className={className} />,
        FaPaw: <FaPaw className={className} />,
        FaBaby: <FaBaby className={className} />,
        FaClock: <FaClock className={className} />,
        FaGlobeAsia: <FaGlobeAsia className={className} />,
        FaCloudSun: <FaCloudSun className={className} />,
        FaTools: <FaTools className={className} />,
        FaLaptop: <FaLaptop className={className} />,
        FaHome: <FaHome className={className} />,
        FaImages: <FaImages className={className} />,
        FaPrint: <FaPrint className={className} />,
        FaDog: <FaDog className={className} />,
        FaBabyIcon: <FaBabyIcon className={className} />,
        FaWallet: <FaWallet className={className} />,
        FaShoppingBag: <FaShoppingBag className={className} />
    };
    return icons[name] || <FaShoppingBag className={className} />;
};

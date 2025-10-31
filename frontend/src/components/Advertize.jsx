import ad1 from '../images/ad-1.png';
import ad6 from '../images/ad-6.png';
import ad10 from '../images/ad-10.png';
import ad5 from '../images/ad-5.jpg';
import dominoz from '../images/dominos.png';
import ad13 from '../images/ad-13.jpg';
import ad14 from '../images/ad-14.png';
import ad8 from '../images/ad-8.jpg';

const Advertize = ({ limitImages = false }) => {
    // Define which images to show based on the limitImages prop
    const leftAds = limitImages ? [ad1, dominoz] : [ad1, dominoz, ad14, ad5, ad6];
    const rightAds = limitImages ? [ad6, ad13] : [ad6, ad13, ad8, ad10,];

    return (
        <div className="relative w-full">
            {/* Left Side Ad - Hidden on mobile */}
            <div className="hidden md:block absolute top-[300px] xs:top-[250px] sm:top-[300px] md:top-[350px] lg:top-[400px] xl:top-[450px] left-2 xs:left-3 sm:left-4 md:left-5 transform -translate-y-1/2 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40">
                {leftAds.map((ad, index) => (
                    <img
                        key={`left-${index}`}
                        src={ad}
                        alt={`Advertisement Left ${index + 1}`}
                        className={`w-[90%] h-auto object-contain rounded-lg shadow-lg ${index < leftAds.length - 1 ? 'mb-16 xs:mb-20 sm:mb-24 md:mb-24' : ''}`}
                    />
                ))}
            </div>

            {/* Right Side Ad - Hidden on mobile */}
            <div className="hidden md:block absolute top-[250px] xs:top-[200px] sm:top-[250px] md:top-[300px] lg:top-[350px] xl:top-[400px] right-0 xs:right-0 sm:right-0 md:right-0 transform -translate-y-1/2 w-16 xs:w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40">
                {rightAds.map((ad, index) => (
                    <img
                        key={`right-${index}`}
                        src={ad}
                        alt={`Advertisement Right ${index + 1}`}
                        className={`w-[90%] h-auto object-contain rounded-lg shadow-lg ${index < rightAds.length - 1 ? 'mb-16 xs:mb-20 sm:mb-24 md:mb-24' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Advertize;
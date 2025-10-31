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
    const leftAds = limitImages ? [ad1, dominoz] : [ad1, dominoz, ad14, ad5];
    const rightAds = limitImages ? [ad6, ad13] : [ad6, ad13, ad8, ad10];

    return (
        <div className="relative w-full ">
            {/* Left Side Ad */}
            <div className="absolute top-[450px] left-5 transform -translate-y-1/2 w-24 md:w-32 lg:w-40 xl:w-48 hidden md:block ">
                {leftAds.map((ad, index) => (
                    <img
                        key={`left-${index}`}
                        src={ad}
                        alt={`Advertisement Left ${index + 1}`}
                        className={`w-[90%] h-auto object-contain rounded-lg shadow-lg ${index < leftAds.length - 1 ? 'mb-24' : ''}`}
                    />
                ))}
            </div>

            {/* Right Side Ad */}
            <div className="absolute top-[350px] right-5  transform -translate-y-1/2 w-24 md:w-32 lg:w-40 xl:w-48 hidden md:block">
                {rightAds.map((ad, index) => (
                    <img
                        key={`right-${index}`}
                        src={ad}
                        alt={`Advertisement Right ${index + 1}`}
                        className={`w-[90%] h-auto object-contain rounded-lg shadow-lg ${index < rightAds.length - 1 ? 'mb-24' : ''}`}
                    />
                ))}
            </div>

        </div>
    );
};

export default Advertize;
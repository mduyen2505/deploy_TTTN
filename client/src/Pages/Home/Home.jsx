import HomeBanner from "../../Components/HomeBanner/HomeBanner";
import FlashDeal from "../../Components/FlashDeal/FlashDeal";
import ProductCatalog from "../../Components/ProductCatalog/ProductCatalog";
import Suggestion from "../../Components/Suggestion/FeaturedProducts";
import Blog from "../../Components/Blog/Blog";
import Footer from "../../Components/Footer/Footer";


const Home =()=>{
    return(
       <>
       
       <HomeBanner/>
       <FlashDeal />
       <ProductCatalog/>
       <Suggestion />
       <Blog />
       <Footer /> 
       </>
    )
   }
   export default Home; 
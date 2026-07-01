import React,{useState,useEffect} from 'react';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import BlogPostModal from './BlogPostModal';
import supabase from '../lib/supabase';

const {FiCalendar,FiClock,FiUser,FiTag,FiEye,FiSearch,FiFilter,FiTrendingUp}=FiIcons;

const BlogPage=()=> {
const [posts,setPosts]=useState([]);
const [loading,setLoading]=useState(true);
const [selectedPost,setSelectedPost]=useState(null);
const [showModal,setShowModal]=useState(false);
const [selectedCategory,setSelectedCategory]=useState('all');
const [searchTerm,setSearchTerm]=useState('');
const [sortBy,setSortBy]=useState('newest');

// Demo posts for fallback
const demoPosts=[ 
{id: 1,title: 'The Fearless Leader: Embracing Authentic Leadership in Uncertain Times',slug: 'fearless-leader-authentic-leadership',excerpt: 'Discover how authentic leadership becomes your superpower during challenging times. Learn the 5 key principles that separate fearless leaders from the rest.',content: `# The Fearless Leader: Embracing Authentic Leadership in Uncertain Times In today's rapidly changing world,the old models of leadership are crumbling. Command-and-control hierarchies are giving way to more collaborative,authentic approaches that inspire rather than intimidate. ## What Makes a Fearless Leader? Fearless leadership isn't about the absence of fear—it's about moving forward despite it. Here are the key characteristics: ### 1. Authentic Self-Expression Fearless leaders show up as their genuine selves. They don't hide behind masks or pretend to have all the answers. This authenticity creates trust and psychological safety within their teams. ### 2. Vulnerability as Strength The most powerful leaders I've worked with understand that vulnerability is not weakness—it's courage. When you admit you don't know something or that you made a mistake,you give others permission to be human too. ### 3. Clear Vision and Purpose Fearless leaders are crystal clear about their "why." They can articulate not just what they're doing,but why it matters. This clarity becomes a north star that guides decisions and inspires action. *Are you ready to step into fearless leadership? The journey begins with a single courageous choice.*`,category: 'leadership',featured_image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',is_featured: true,read_time: '8 min read',created_at: '2024-01-15T10:00:00Z',views: 1247},
// Add more demo posts as needed...
];

useEffect(()=> {
fetchPosts();
},[]);

const fetchPosts=async ()=> {
try {
const {data,error}=await supabase 
.from('blog_posts_la2024') 
.select('*') 
.eq('is_published',true) 
.order('created_at',{ascending: false});

if (error) throw error;
setPosts(data && data.length > 0 ? data : demoPosts);
setLoading(false);
} catch (error) {
console.error('Error fetching posts:',error);
// Fallback to demo data if Supabase fails 
setPosts(demoPosts);
setLoading(false);
}
};

const categories=[ 
{id: 'all',name: 'All Articles',count: posts.length},
{id: 'leadership',name: 'Leadership',count: posts.filter(p=> p.category==='leadership').length},
{id: 'coaching',name: 'Coaching',count: posts.filter(p=> p.category==='coaching').length},
{id: 'transformation',name: 'Transformation',count: posts.filter(p=> p.category==='transformation').length},
{id: 'business',name: 'Business',count: posts.filter(p=> p.category==='business').length} 
];

const handlePostClick=(post)=> {
setSelectedPost(post);
setShowModal(true);
};

const filteredAndSortedPosts=posts 
.filter(post=> {
const matchesCategory=selectedCategory==='all' || post.category===selectedCategory;
const matchesSearch=post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
return matchesCategory && matchesSearch;
}) 
.sort((a,b)=> {
switch (sortBy) {
case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
case 'popular': return (b.views || 0) - (a.views || 0);
case 'newest': 
default: return new Date(b.created_at) - new Date(a.created_at);
}
});

const featuredPosts=posts.filter(post=> post.is_featured);

if (loading) {
return ( 
<div className="min-h-screen bg-white flex items-center justify-center"> 
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div> 
</div> 
);
} 

return ( 
<> 
<section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-navy-800 relative overflow-hidden"> 
{/* Background decorations - Hidden on mobile */} 
<div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/10 rounded-full blur-3xl hidden sm:block"></div> 
<div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div> 

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
{/* Page Header */} 
<motion.div 
initial={{opacity: 0,y: 30}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.8}} 
className="text-center mb-12 sm:mb-16" 
> 
<motion.div 
initial={{scale: 0}} 
animate={{scale: 1}} 
transition={{delay: 0.3,type: "spring"}} 
className="inline-flex items-center bg-gold-400/20 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6" 
> 
<span className="text-gold-400 font-montserrat font-medium text-sm sm:text-base"> 
Insights & Resources 
</span> 
</motion.div> 

<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 sm:mb-6 leading-tight"> 
Leadership Insights & 
<span className="text-gold-400 font-dancing block mt-2"> 
Transformation Stories 
</span> 
</h1> 

<p className="text-lg sm:text-xl text-gray-300 font-montserrat max-w-3xl mx-auto leading-relaxed"> 
Discover powerful strategies,real transformation stories,and actionable insights to{' '} 
<span className="text-gold-400 font-semibold">accelerate your leadership journey</span>{' '} 
and create lasting impact. 
</p> 
</motion.div> 
</div> 
</section>

{/* Main Content Section */}
<section className="py-12 sm:py-16 lg:pb-20 bg-white relative overflow-hidden">
{/* Background decorations - Hidden on mobile */} 
<div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-400/5 rounded-full blur-3xl hidden sm:block"></div> 
<div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-navy-800/5 rounded-full blur-3xl hidden sm:block"></div> 

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Search and Filter Bar */} 
<motion.div 
initial={{opacity: 0,y: 20}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.6}} 
className="bg-luxury-pearl p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg mb-8 sm:mb-12" 
> 
<div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between"> 
{/* Search */} 
<div className="relative flex-1 max-w-md"> 
<SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> 
<input 
type="text" 
placeholder="Search articles..." 
value={searchTerm} 
onChange={(e)=> setSearchTerm(e.target.value)} 
className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent font-montserrat text-sm sm:text-base" 
/> 
</div> 

{/* Sort */} 
<div className="flex items-center space-x-3 sm:space-x-4"> 
<SafeIcon icon={FiFilter} className="text-gray-500 hidden sm:block" /> 
<select 
value={sortBy} 
onChange={(e)=> setSortBy(e.target.value)} 
className="border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:ring-2 focus:ring-gold-400 focus:border-transparent text-sm sm:text-base" 
> 
<option value="newest">Newest First</option> 
<option value="oldest">Oldest First</option> 
<option value="popular">Most Popular</option> 
</select> 
</div> 
</div> 
</motion.div> 

{/* Category Filter - Responsive horizontal scroll on mobile */} 
<motion.div 
initial={{opacity: 0,y: 20}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.6,delay: 0.1}} 
className="mb-12 sm:mb-16" 
> 
{/* Mobile: Horizontal scroll */} 
<div className="sm:hidden overflow-x-auto pb-4"> 
<div className="flex space-x-3 min-w-max px-1"> 
{categories.map((category)=> ( 
<motion.button 
key={category.id} 
whileHover={{scale: 1.05}} 
whileTap={{scale: 0.95}} 
onClick={()=> setSelectedCategory(category.id)} 
className={`px-4 py-2 rounded-full font-montserrat font-medium transition-all duration-300 whitespace-nowrap text-sm ${selectedCategory===category.id ? 'bg-navy-800 text-white shadow-xl' : 'bg-luxury-pearl text-navy-800 hover:bg-navy-50 shadow-md'}`} 
> 
{category.name} ({category.count}) 
</motion.button> 
))} 
</div> 
</div> 

{/* Desktop: Centered flex */} 
<div className="hidden sm:flex flex-wrap justify-center gap-3 sm:gap-4"> 
{categories.map((category)=> ( 
<motion.button 
key={category.id} 
whileHover={{scale: 1.05}} 
whileTap={{scale: 0.95}} 
onClick={()=> setSelectedCategory(category.id)} 
className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-montserrat font-medium transition-all duration-300 text-sm sm:text-base ${selectedCategory===category.id ? 'bg-navy-800 text-white shadow-xl' : 'bg-luxury-pearl text-navy-800 hover:bg-navy-50 shadow-md'}`} 
> 
{category.name} ({category.count}) 
</motion.button> 
))} 
</div> 
</motion.div> 

{/* Featured Posts */} 
{selectedCategory==='all' && featuredPosts.length > 0 && ( 
<motion.div 
initial={{opacity: 0,y: 30}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.8}} 
className="mb-16 sm:mb-20" 
> 
<div className="flex items-center mb-6 sm:mb-8"> 
<SafeIcon icon={FiTrendingUp} className="text-gold-600 text-xl mr-3" /> 
<h2 className="text-xl sm:text-2xl font-playfair font-bold text-navy-800">Featured Articles</h2> 
</div> 

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"> 
{featuredPosts.map((post,index)=> ( 
<motion.article 
key={post.id} 
initial={{opacity: 0,y: 30}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.6,delay: index * 0.1}} 
whileHover={{y: -10,scale: 1.02}} 
onClick={()=> handlePostClick(post)} 
className="bg-luxury-pearl rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer" 
> 
<div className="relative overflow-hidden"> 
<img 
src={post.featured_image} 
alt={post.title} 
className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
/> 
<div className="absolute top-3 sm:top-4 left-3 sm:left-4"> 
<span className="bg-gold-gradient text-navy-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-montserrat font-semibold"> 
Featured 
</span> 
</div> 
<div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1"> 
<div className="flex items-center space-x-1 text-white text-xs"> 
<SafeIcon icon={FiEye} /> 
<span>{post.views?.toLocaleString() || '0'}</span> 
</div> 
</div> 
</div> 

<div className="p-6 sm:p-8"> 
<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 font-montserrat mb-3 sm:mb-4"> 
<div className="flex items-center space-x-1"> 
<SafeIcon icon={FiCalendar} className="text-gold-600" /> 
<span>{new Date(post.created_at).toLocaleDateString()}</span> 
</div> 
<div className="flex items-center space-x-1"> 
<SafeIcon icon={FiClock} className="text-gold-600" /> 
<span>{post.read_time}</span> 
</div> 
<div className="flex items-center space-x-1"> 
<SafeIcon icon={FiTag} className="text-gold-600" /> 
<span className="capitalize">{post.category}</span> 
</div> 
</div> 

<h3 className="text-lg sm:text-xl font-playfair font-bold text-navy-800 mb-3 group-hover:text-gold-600 transition-colors"> 
{post.title} 
</h3> 

<p className="text-gray-700 font-montserrat leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base"> 
{post.excerpt} 
</p> 

<div className="flex items-center justify-between"> 
<div className="flex items-center space-x-2"> 
<SafeIcon icon={FiUser} className="text-gold-600" /> 
<span className="text-sm text-gray-600 font-montserrat"> 
Lillian Adegbola 
</span> 
</div> 
<motion.div 
whileHover={{x: 5}} 
className="text-navy-800 hover:text-gold-600 font-montserrat font-semibold transition-colors text-sm sm:text-base" 
> 
Read Article → 
</motion.div> 
</div> 
</div> 
</motion.article> 
))} 
</div> 
</motion.div> 
)} 

{/* All Posts Grid */} 
<motion.div 
initial={{opacity: 0,y: 30}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.8,delay: 0.2}} 
> 
<h2 className="text-xl sm:text-2xl font-playfair font-bold text-navy-800 mb-6 sm:mb-8"> 
{selectedCategory==='all' ? `All Articles (${filteredAndSortedPosts.length})` : `${categories.find(c=> c.id===selectedCategory)?.name} Articles (${filteredAndSortedPosts.length})`} 
</h2> 

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> 
{filteredAndSortedPosts.map((post,index)=> ( 
<motion.article 
key={post.id} 
initial={{opacity: 0,y: 30}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.6,delay: index * 0.1}} 
whileHover={{y: -10,scale: 1.02}} 
onClick={()=> handlePostClick(post)} 
className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gold-400/20 group cursor-pointer" 
> 
<div className="relative overflow-hidden"> 
<img 
src={post.featured_image} 
alt={post.title} 
className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
/> 
{post.is_featured && ( 
<div className="absolute top-2 sm:top-3 left-2 sm:left-3"> 
<span className="bg-gold-gradient text-navy-900 px-2 py-1 rounded-full text-xs font-montserrat font-semibold"> 
Featured 
</span> 
</div> 
)} 
<div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1"> 
<div className="flex items-center space-x-1 text-white text-xs"> 
<SafeIcon icon={FiEye} /> 
<span>{post.views?.toLocaleString() || '0'}</span> 
</div> 
</div> 
</div> 

<div className="p-4 sm:p-6"> 
<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-600 font-montserrat mb-3"> 
<div className="flex items-center space-x-1"> 
<SafeIcon icon={FiCalendar} className="text-gold-600" /> 
<span>{new Date(post.created_at).toLocaleDateString()}</span> 
</div> 
<div className="flex items-center space-x-1"> 
<SafeIcon icon={FiClock} className="text-gold-600" /> 
<span>{post.read_time}</span> 
</div> 
</div> 

<h3 className="text-base sm:text-lg font-playfair font-bold text-navy-800 mb-2 sm:mb-3 group-hover:text-gold-600 transition-colors line-clamp-2"> 
{post.title} 
</h3> 

<p className="text-gray-700 font-montserrat text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3"> 
{post.excerpt} 
</p> 

<div className="flex items-center justify-between"> 
<span className="text-xs text-gold-600 font-montserrat font-semibold capitalize bg-gold-400/10 px-2 py-1 rounded-full"> 
{post.category} 
</span> 
<motion.div 
whileHover={{x: 3}} 
className="text-navy-800 hover:text-gold-600 font-montserrat font-semibold text-sm transition-colors" 
> 
Read → 
</motion.div> 
</div> 
</div> 
</motion.article> 
))} 
</div> 

{filteredAndSortedPosts.length===0 && ( 
<div className="text-center py-16"> 
<div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"> 
<SafeIcon icon={FiSearch} className="text-gray-400 text-xl sm:text-2xl" /> 
</div> 
<h3 className="text-lg sm:text-xl font-playfair font-bold text-gray-600 mb-2"> 
No articles found 
</h3> 
<p className="text-gray-500 font-montserrat text-sm sm:text-base"> 
Try adjusting your search or filter criteria 
</p> 
</div> 
)} 
</motion.div> 

{/* Newsletter CTA */} 
<motion.div 
initial={{opacity: 0,y: 50}} 
animate={{opacity: 1,y: 0}} 
transition={{duration: 0.8,delay: 0.4}} 
className="text-center mt-16 sm:mt-20" 
> 
<div className="bg-navy-800 text-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl mx-auto"> 
<h3 className="text-xl sm:text-2xl lg:text-3xl font-playfair font-bold mb-3 sm:mb-4"> 
Never Miss a Leadership Insight 
</h3> 
<p className="text-lg sm:text-xl font-montserrat text-gray-200 mb-6 sm:mb-8 leading-relaxed"> 
Get weekly leadership tips,transformation stories,and exclusive resources delivered to your inbox. 
</p> 
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto"> 
<input 
type="email" 
placeholder="Enter your email" 
className="flex-1 px-4 py-3 rounded-full text-navy-900 font-montserrat focus:ring-2 focus:ring-gold-400 focus:outline-none text-sm sm:text-base" 
/> 
<motion.button 
whileHover={{scale: 1.05}} 
whileTap={{scale: 0.95}} 
className="bg-gold-gradient text-navy-900 px-6 py-3 rounded-full font-montserrat font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base" 
> 
Subscribe 
</motion.button> 
</div> 
</div> 
</motion.div>
</div>
</section>

{/* Blog Post Modal */} 
<BlogPostModal 
isOpen={showModal} 
onClose={()=> setShowModal(false)} 
post={selectedPost} 
/> 
</> 
);
};

export default BlogPage;
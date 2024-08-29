import React, {useState, useEffect } from 'react';

import { Loader, Card, FormField } from '../components';

const RenderCards = ({ data, title }) => {
    if(data?.length > 0 ) {
        return (
            data.map((post) => <Card key={post._id} {...post} />)
        );
    } 

    return(
        <h2 className="mt-5 font-bold text-[#6449ff] text-xl-uppercase">{title}</h2>
    )
}



const Home = () => {
    const [ loading, setLoading ] = useState(false);
    const [ allPosts, setAllPosts ] = useState(null);
    
    const [searchText, setSearchText] = useState('');
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);

            try {
                const response = await fetch('https://ai-image-generator-ru4a.onrender.com/api/v1/post', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if(response.ok){
                    const result = await response.json();

                    setAllPosts(result.data.reverse());
                }
            } catch (error) {
                alert(error)
            } finally{
                setLoading(false)
            }
        };

        fetchPosts();
    }, [])

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        setSearchTimeout(
            setTimeout(() => {
                        const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

                        setSearchedResults(searchResults)
                    }, 500)
        ); 
    }


  return (
    <section className="max-w-7xl mx-auto p-5" >
        <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg" >Jeff's Community Showcase!</h1>
            <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">My name is Jeff and I created an Image Generator for myself and I thought other people could use it as well! Take a look at what other people have created and download some of them or click on "Create" button on the top right to create your own!</p>
        </div>
        <div className="mt-16" >
            <FormField 
                labelName="Search Posts"
                type="text"
                name="text"
                placeholder="Search Posts"
                value={searchText}
                handleChange={handleSearchChange}
                
            />
        </div>
        <div className="mt-10">
            { loading ? (
                <div className="flex justify-center item-center">
                    <Loader />
                </div>    
            ) : (
                <>
                    { searchText && (
                        <h2 className="font-medium text-[#666e75] text-xl mb-3" >Showing Results for <span >{searchText}</span></h2>
                    )}

                <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3" >
                    {searchText ? (
                        <RenderCards  
                            data={searchedResults}
                            title="No search results found"
                        />
                    ) : (
                        <RenderCards 
                            data={allPosts}
                            title="No Posts Found"
                        />
                    )}
                </div>
                </>
            ) }
        </div>
    </section>
  )
}

export default Home

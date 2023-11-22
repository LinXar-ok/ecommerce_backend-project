import { Layout, Spinner } from '@/components';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MdUpload } from 'react-icons/md';
import { ReactSortable } from 'react-sortablejs';

const ProductForm = ({
    _id,
    images: existingImages,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    category: assignedCategory,
    properties:assignedProperties, }) => {

    const [title, setTitle] = useState(existingTitle || "")
    const [description, setDescription] = useState(existingDescription || "")
    const [price, setPrice] = useState(existingPrice || "")
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);


    async function saveProduct(e){
        e.preventDefault();
        const data = {title, description, price, images, category, properties: productProperties};
        if (_id) {
            //update product
            await axios.put('/api/products', {...data, _id})
        } else {
            //create product
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages (e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/upload', data);

            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images){
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category)
        propertiesToFill.push(...catInfo.properties);

        while (catInfo?.parentCategory?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parentCategory?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    return (

        <form onSubmit={saveProduct}>
            {/* <h1>New Product</h1> */}
            <label>Product name</label>
            <input
                type="text"
                placeholder='product name'
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <label>Category</label>
            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                <option value=''>Uncategorized</option>
                {categories.length > 0  && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}

            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p._id} className="flex gap-1">
                    <div>{p.name}</div>
                    <select value={productProperties[p.name]}
                        onChange={e => setProductProp(
                            p.name, e.target.value
                        )}

                    >
                        {p.values.map(v => (
                            <option key={p._id} value={v}>{v}</option>
                        ))}
                    </select>
                </div>

            ))}

            <label>
                Photos
            </label>
            <div className='mb-2 flex flex-wrap gap-1'>

                <ReactSortable list={images} setList={updateImagesOrder} className='flex flex-wrap gap-1'>
                {!!images?.length && images.map(link => (
                    <div key={link} className='h-24'>
                        <img src={link} alt='' className='rounded-lg'/>
                    </div>
                ))}
                </ReactSortable>
                {isUploading && (
                    <div className='h-24 flex items-center'>
                        <Spinner />
                    </div>
                )}

                <label className='bg-gray-200 h-24 w-24 text-center flex justify-center items-center gap-1 text-sm text-gray-500 rounded-lg cursor-pointer'>
                    <MdUpload className='w-5 h-5'/>
                    Upload
                    <input type='file' className='hidden' onChange={uploadImages}/>
                </label>
            </div>
            <label>Product description</label>
            <textarea
                placeholder='description'
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <label>Price(in USD)</label>
            <input type="text"
                placeholder='price'
                value={price}
                onChange={e => setPrice(e.target.value)}
            />
            <button type='submit' className='btn-primary'>Save</button>
        </form>


    )
}

export default ProductForm
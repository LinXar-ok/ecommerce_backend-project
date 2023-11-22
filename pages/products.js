import { Layout } from '@/components'
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdDeleteOutline, MdEdit } from 'react-icons/md';

const products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, []);
  return (
    <Layout>
      <Link className="btn-primary" href='/products/new'>Add new product
    </Link>
      <table className='basic_table mt-2'>
        <thead>
          <tr>
            <td>Product name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>

                <Link href={'/products/edit/' + product._id}>
                  <MdEdit className='w-4 h-5'/>
                  Edit
                </Link>
                <Link href={'/products/delete/' + product._id}>
                  <MdDeleteOutline className='w-5 h-5'/>
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}

export default products
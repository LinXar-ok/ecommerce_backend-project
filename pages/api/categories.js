import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    try {
        if (method === 'GET') {
            res.json(await Category.find().populate('parentCategory'));
        }

        if (method === 'POST') {
            const {name, parentCategory, properties} = req.body;
            const categoryDoc = await Category.create({
                name,
                parentCategory: parentCategory || undefined,
                properties,
            });
            res.json(categoryDoc);
        }

        if (method === 'PUT') {
            const {name, parentCategory, _id, properties} = req.body;
            const categoryDoc = await Category.updateOne({_id}, {
                name,
                parentCategory,
                properties,
            });
            res.json(categoryDoc);
        }

        if (method === 'DELETE') {
            const {_id} = req.query;
            await Category.deleteOne({_id});
            res.json('ok');
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

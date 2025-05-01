import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: { name: 'asc' }
        });
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const createCategory = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const existingCategory = await prisma.categories.findFirst({
            where: { name: { equals: name, mode: 'insensitive' } }
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = await prisma.categories.create({
            data: { name }
        });

        res.status(201).json({ 
            message: 'Category has been successfully created.',
            category: newCategory 
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
};

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const existingCategory = await prisma.categories.findFirst({
            where: { 
                AND: [
                    { name: { equals: name, mode: 'insensitive' } },
                    { id: { not: parseInt(id, 10) } }
                ]
            }
        });

        if (existingCategory) {
            return res.status(400).json({ error: 'Category name already exists' });
        }

        const updatedCategory = await prisma.categories.update({
            where: { id: parseInt(id, 10) },
            data: { name }
        });

        res.status(200).json({ 
            message: 'Category has been successfully updated.',
            category: updatedCategory 
        });
    } catch (error) {
        console.error('Error updating category:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    
    console.log(`Attempting to delete category with ID: ${id}`);
    
    try {
        const categoryId = parseInt(id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID format' });
        }

        const categoryExists = await prisma.categories.findUnique({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const postsCount = await prisma.posts.count({
            where: { category_id: categoryId }
        });

        if (postsCount > 0) {
            return res.status(400).json({ 
                error: `This category cannot be deleted because it is used by ${postsCount} post(s).` 
            });
        }

        await prisma.categories.delete({
            where: { id: categoryId }
        });

        console.log(`Successfully deleted category with ID: ${id}`);
        res.status(200).json({ message: 'Category successfully deleted' });
        
    } catch (error) {
        console.error(`Error deleting category with ID ${id}:`, error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Category not found' });
        } 
        
        if (error.code === 'P2003') {
            return res.status(400).json({ 
                error: 'Cannot delete this category because it is referenced by existing posts' 
            });
        }
        
        if (error.code === 'P2001') {
            return res.status(400).json({ error: 'Cannot process request due to database constraints' });
        }
        
        res.status(500).json({ 
            error: 'An error occurred while deleting the category',
            details: error.message,
            code: error.code || 'UNKNOWN'
        });
    }
};

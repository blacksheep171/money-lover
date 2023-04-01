import db from "../models";
const Users = db.users;
const Categories = db.categories;

export const getAll = async () => {
    try{
        const categoryData = await Categories.findAll();
        return {
            message: 'successfully',
            data: categoryData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const getDetails = async (id) => {
    try{
        const categoryData = await Categories.findByPk(id);
        if(categoryData == null){
            return {
                message: 'id not found',
                data: null
            }
        }
        return {
            message: 'successfully',
            data: categoryData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const createCategory = async ({params}) => {
    let queryParams = {};
    let user = Users.findByPk(params.user_id);
    if (user == 0) {
        return {
            message: 'user not found',
            data: null
        }
    };
    try{
         queryParams = {
            name: params.name,
            description: params.description,
            user_id: params.user_id,
        }
        const categoryData = await Categories.create(queryParams);
        return {
            message: 'create successfully',
            data: categoryData
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const update = async ({ id, params }) => {
    let queryParams = {};
    let categoryData = null;
    try {
        const category = await Categories.findByPk(id);
        if(category == 0){
            return {
                message: 'id not found',
                datas: null
            }
        }
        
        const userData = await Users.findByPk(params.user_id);

        if(userData == 0){
            return {
                message: 'user not found',
                data: null
            }
        }

        queryParams = {
            name: params.name,
            description: params.description,
            user_id: params.user_id,
        }
        const user =  await Categories.update(queryParams,{
            where: { id: id }
        });
        if(user) {
            categoryData = await getDetails(id);
        }
        return {
            message: 'update successfully',
            data: categoryData.data
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }
}

export const removeCategory = async ({id}) => {
    try{
        const Category = await Categories.findByPk(id);

        if(Category == null){
            return {
                message: 'id not found',
                data: null
            }
        }
        
        const categoryData = await Categories.destroy({
            where: { id: id },
        });

        return {
            message: 'delete successfully',
            data: null
        }
    }catch(e){
        console.log(e);
        return {
            message: e,
            data: null
        }
    }   
}
export default function crudRepository(model) {
  return {
    create: async function (data) {
      const createdDoc = await model.create(user);
      return createdDoc;
    },
    getAll: async function () {
      const allDocs = await model.find();
      return allDocs;
    },
    delete: async function (id) {
      const response = await model.findByIdAndDelete(id);
      return response;
    },
    update: async function (id, user) {
      const updatedDoc = await model.findByIdAndUpdate(id, user, { new: true });
      return updatedDoc;
    },
  };
}

export default function crudRepository(model) {
  return {
    create: async function (data) {
      const createdDoc = await model.create(data);
      return createdDoc;
    },
    getAll: async function () {
      const allDocs = await model.find();
      return allDocs;
    },
    getById: async function (id) {
      const doc = await model.findById(id);
      return doc;
    },
    delete: async function (id) {
      const response = await model.findByIdAndDelete(id);
      return response;
    },
    update: async function (id, user) {
      const updatedDoc = await model.findByIdAndUpdate(id, user, { new: true });
      return updatedDoc;
    },
    deleteMany: async function (modelId) {
      const response = await model.deleteMany({
        _id: {
          $in: modelId,
        },
      });
      return response;
    },
  };
}

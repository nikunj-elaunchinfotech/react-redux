
module.exports = (mongoose, mongoosePaginate) => {
  var schema = mongoose.Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      designation: String,
      addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  schema.plugin(mongoosePaginate);

  const Employe = mongoose.model("Employe", schema);
  return Employe;
};

const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: "Pizza needs a name!",
      trim: true,
    },
    createdBy: {
      type: String,
      required: "Creator needs a name!",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      default: "Large",
    },
    toppings: [],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    // prevents virtuals from creating duplicate of _id as `id`
    id: false,
  }
);

// get total count of comments and replies on retrieval

// Here we're using the .reduce() method to tally up the total
// of every comment with its replies.
// In its basic form, .reduce() takes two parameters,
// an accumulator and a currentValue. Here, the accumulator is total,
// and the currentValue is comment. As .reduce() walks through the array,
// it passes the accumulating total and the current value of comment
// into the function, with the return of the function
// revising the total for the next iteration through the array.

PizzaSchema.virtual("commentCount").get(function () {
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

// export the Pizza model
module.exports = Pizza;

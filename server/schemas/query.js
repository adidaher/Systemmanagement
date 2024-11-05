const { db } = require("../pgAdaptor");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
} = require("graphql");
const {
  UserType,
  TaskType,
  EventsType,
  OfficeType,
  CustomersType,
  CaseType,
  CaseOfCustomersType,
  CaseDetailsType,
  ChatType,
} = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM users WHERE user_id = $1`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    retrieveTasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        const query = `
          SELECT 
            tasks.task_id,
            tasks.task_name,
            tasks.task_partners,
            tasks.task_status,
            tasks.task_deadline,
            tasks.task_description,
            COALESCE(json_agg(json_build_object(
              'subtask_id', subtasks.subtask_id,
              'subtask_name', subtasks.subtask_name,
              'subtask_status', subtasks.subtask_status,
              'subtask_deadline', subtasks.subtask_deadline,
              'subtask_description', subtasks.subtask_description
            )) FILTER (WHERE subtasks.subtask_id IS NOT NULL), '[]') AS subtasks
          FROM 
            tasks
          LEFT JOIN 
            subtasks ON tasks.task_id = subtasks.task_id
          GROUP BY 
            tasks.task_id
          ORDER BY 
            tasks.task_id;
        `;

        return db
          .manyOrNone(query)
          .then((tasks) => tasks)
          .catch((err) => {
            console.error("Error fetching tasks:", err);
            throw new Error("Failed to fetch tasks.");
          });
      },
    },

    allUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        const query = `SELECT * FROM users`;

        return db
          .any(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    getUserByUsername: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
      },
      resolve(parent, args) {
        const query = `SELECT * FROM users WHERE username = $1`;
        const values = [args.username];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    GetUserByEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },

      resolve(parent, args) {
        const { email, password } = args;
        const query = `SELECT * FROM users WHERE email = $1 and password = $2`;
        const values = [email, password];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in GetUserByEmail resolver:", err);
          });
      },
    },

    getTasksByStatus: {
      type: new GraphQLList(TaskType),
      args: {
        status: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { status } = args;
        const query = `SELECT * FROM tasks WHERE task_status = $1`;
        const values = [status];

        return db
          .manyOrNone(query, values)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in GetUserByEmail resolver:", err);
          });
      },
    },

    getAllTasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        const query = `SELECT * FROM tasks`;
        return db
          .manyOrNone(query)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in getAllTasks resolver:", err);
          });
      },
    },

    getTaskOfCase: {
      type: new GraphQLList(TaskType),
      args: {
        case_id: { type: GraphQLID },
      },
      resolve(parent, args) {
        const query = `SELECT * FROM tasks WHERE case_id = $1 ORDER BY task_deadline Desc`;
        const values = [args.case_id];
        return db
          .manyOrNone(query, values)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in getTaskOfCase resolver:", err);
          });
      },
    },
    userEvents: {
      type: new GraphQLList(EventsType),
      args: {
        userEmail: { type: GraphQLString },
      },
      resolve(parent, args) {
        const today = new Date();
        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        const query = `
        SELECT * 
        FROM events 
        WHERE (user_id = (SELECT user_id FROM users WHERE email = $1) OR $1 IN (SELECT shared_with FROM events))
          AND start_timestamp >= $2 ORDER BY start_timestamp ASC;
      `;
        const values = [args.userEmail, startOfToday];

        return db
          .any(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allOffice: {
      type: new GraphQLList(OfficeType),

      resolve() {
        const query = `
        SELECT * 
        FROM offices
      `;

        return db
          .any(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    allcustomers: {
      type: new GraphQLList(CustomersType),

      resolve() {
        const query = `
        SELECT * 
        FROM Customers
      `;

        return db
          .any(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    casesOfCustomersDetails: {
      type: new GraphQLList(CaseOfCustomersType),
      args: {
        customer_id: { type: GraphQLID },
      },
      resolve: (parent, args, context) => {
        const { customer_id } = args;
        const query = `
          SELECT 
            cc.case_id, 
            c.customer_id, 
            c.office_id AS customer_office_id,
            c.first_name,
            c.last_name,
            c.email,
            o.office_id AS office_id,
            o.name AS office_name,
            ca.id AS case_id,
            ca.case_description
          FROM case_of_customers cc
          JOIN customers c ON cc.customer_id = c.customer_id
          JOIN offices o ON cc.office_id = o.office_id
          JOIN cases ca ON cc.case_id = ca.id
          WHERE cc.customer_id = $1;
        `;
        const values = [customer_id];

        return db
          .manyOrNone(query, values)
          .then((res) => {
            return res.map((row) => ({
              case_id: row.case_id,
              customer: {
                customer_id: row.customer_id,
                office_id: row.customer_office_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
              },
              office: {
                office_id: row.office_id,
                name: row.office_name,
              },
              case_details: {
                id: row.case_id,
                office_id: row.office_id,
                case_description: row.case_description,
              },
            }));
          })
          .catch((err) => {
            console.error("Error fetching cases of customers:", err);
            throw err;
          });
      },
    },

    casesOfCustomersDetailsByOfficeID: {
      type: new GraphQLList(CaseOfCustomersType),
      args: {
        office_id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        const { office_id } = args;
        const query = `
       SELECT 
        cc.case_id, 
        c.customer_id, 
        c.office_id AS customer_office_id,
        c.first_name,
        c.last_name,
        c.email,
        o.office_id AS office_id,
        o.name AS office_name,
        ca.id AS case_id,
        ca.case_description
      FROM case_of_customers cc
      JOIN customers c ON cc.customer_id = c.customer_id
      JOIN offices o ON cc.office_id = o.office_id
      JOIN cases ca ON cc.case_id = ca.id
      WHERE cc.office_id = $1;
        `;
        const values = [office_id];

        return db
          .manyOrNone(query, values)
          .then((res) => {
            return res.map((row) => ({
              case_id: row.case_id,
              customer: {
                customer_id: row.customer_id,
                office_id: row.customer_office_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
              },
              office: {
                office_id: row.office_id,
                name: row.office_name,
              },
              case_details: {
                id: row.case_id,
                office_id: row.office_id,
                case_description: row.case_description,
              },
            }));
          })
          .catch((err) => {
            console.error("Error fetching cases of customers:", err);
            throw err;
          });
      },
    },

    getChatsByOfficeId: {
      type: new GraphQLList(ChatType),
      args: {
        office_id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        const { office_id } = args;
        const query = `
        SELECT chats.id, chats.message, chats.sent_at, 
               users.user_id AS user_id, users.username, users.email, users.first_name, users.last_name,
               offices.office_id AS office_id, offices.name AS office_name
        FROM chats
        JOIN users ON chats.sender_id = users.user_id
        JOIN offices ON chats.office_id = offices.office_id
        WHERE chats.office_id = $1
        ORDER BY chats.sent_at ASC
      `;
        const values = [office_id];
        return db
          .manyOrNone(query, values)
          .then((res) => {
            console.log(res);
            return res.map((row) => ({
              id: row.id,
              message: row.message,
              sent_at: row.sent_at,
              sender: {
                user_id: row.user_id,
                username: row.username,
                email: row.email,
                first_name: row.first_name,
                last_name: row.last_name,
              },
              office: {
                office_id: row.office_id,
                name: row.office_name,
              },
            }));
          })
          .catch((err) => {
            console.error("Error fetching cases of customers:", err);
            throw err;
          });
      },
    },
  },
});

exports.query = RootQuery;

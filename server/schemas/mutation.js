const graphql = require("graphql");
const db = require("../pgAdaptor").db;
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean } = graphql;
const {
  UserType,
  TaskType,
  EventsType,
  CustomersType,
  CaseType,
  CaseOfCustomersType,
  OfficeType,
  ChatType,
} = require("./types");

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        manager_id: { type: GraphQLID },
        office_id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `
          INSERT INTO users (username, email, password, phone, role, first_name, last_name, manager_id, office_id) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
          RETURNING *`;
        const values = [
          args.username,
          args.email,
          args.password,
          args.phone,
          args.role,
          args.first_name,
          args.last_name,
          args.manager_id,
          args.office_id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        user_id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        manager_id: { type: GraphQLID },
        office_id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `
          UPDATE users
          SET username = $1, email = $2, password = $3, phone = $4, role = $5, first_name = $6, last_name = $7, manager_id = $8, office_id = $9
          WHERE user_id = $10
          RETURNING *`;
        const values = [
          args.username,
          args.email,
          args.password,
          args.phone,
          args.role,
          args.first_name,
          args.last_name,
          args.manager_id,
          args.office_id,
          args.user_id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    addTask: {
      type: TaskType,
      args: {
        task_name: { type: GraphQLString },
        task_partners: { type: GraphQLString },
        task_status: { type: GraphQLString },
        task_deadline: { type: GraphQLString },
        task_description: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO tasks(task_name, task_partners, task_status, task_deadline, task_description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.task_name,
          args.task_partners,
          args.task_status,
          args.task_deadline,
          args.task_description,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateTaskStatus: {
      type: TaskType,
      args: {
        task_id: { type: GraphQLID },
        task_status: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `UPDATE tasks SET task_status = $1 WHERE task_id = $2 RETURNING *`;
        const values = [args.task_status, args.task_id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    updateEvent: {
      type: EventsType,
      args: {
        id: { type: GraphQLID },
        user_id: { type: GraphQLID },
        title: { type: GraphQLString },
        start_timestamp: { type: GraphQLString },
        end_timestamp: { type: GraphQLString },
        event_class: { type: GraphQLString },
        shared_with: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `
          UPDATE events 
          SET user_id = $1, title = $2, start_timestamp = $3, end_timestamp = $4, event_class = $5, shared_with = $6
          WHERE id = $7
          RETURNING *
          `;
        const values = [
          args.user_id,
          args.title,
          args.start_timestamp,
          args.end_timestamp,
          args.event_class,
          args.shared_with,
          args.id,
        ];
        console.log(values);
        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addCustomer: {
      type: CustomersType,
      args: {
        office_id: { type: GraphQLID },
        last_name: { type: GraphQLString },
        first_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gov_id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO Customers(office_id, last_name, first_name, email, gov_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.office_id,
          args.last_name,
          args.first_name,
          args.email,
          args.gov_id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateCustomer: {
      type: CustomersType,
      args: {
        customer_id: { type: GraphQLID },
        office_id: { type: GraphQLID },
        last_name: { type: GraphQLString },
        first_name: { type: GraphQLString },
        email: { type: GraphQLString },
        gov_id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `
          UPDATE customers 
          SET office_id = $2, last_name = $3, first_name = $4, email = $5, gov_id = $6 
          WHERE customer_id = $1 
          RETURNING *`;
        const values = [
          args.customer_id,
          args.office_id,
          args.last_name,
          args.first_name,
          args.email,
          args.gov_id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    addEvent: {
      type: EventsType,
      args: {
        user_id: { type: GraphQLID },
        title: { type: GraphQLString },
        start_timestamp: { type: GraphQLString },
        event_class: { type: GraphQLString },
        shared_with: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO events(user_id, title, start_timestamp, event_class, shared_with) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.user_id,
          args.title,
          args.start_timestamp,
          args.event_class,
          args.shared_with,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    addOffice: {
      type: OfficeType,
      args: {
        name: { type: GraphQLString },
        manager: { type: GraphQLString },
        location: { type: GraphQLString },
        phone: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `
        INSERT INTO offices ( name, manager, location, phone)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
        const values = [args.name, args.manager, args.location, args.phone];
        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => {
            throw new Error("Error adding office: " + err.message);
          });
      },
    },

    deleteEvent: {
      type: EventsType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteCustomer: {
      type: CustomersType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM customers WHERE customer_id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM users WHERE user_id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    deleteTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    deleteCase: {
      type: new GraphQLObjectType({
        name: "DeleteCaseResponse",
        fields: {
          case_id: { type: GraphQLID },
          success: { type: GraphQLBoolean },
          message: { type: GraphQLString },
        },
      }),
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        return db
          .tx((t) => {
            const deleteCaseOfCustomers = t.none(
              `DELETE FROM case_of_customers WHERE case_id = $1`,
              [args.id]
            );
            const deleteCase = t.one(
              `DELETE FROM cases WHERE id = $1 RETURNING id`,
              [args.id]
            );

            return t.batch([deleteCaseOfCustomers, deleteCase]);
          })
          .then((data) => ({
            case_id: data[1].id,
            success: true,
            message: "Case deleted successfully",
          }))
          .catch((err) => ({ success: false, message: err.message }));
      },
    },
    deleteOffice: {
      type: OfficeType,
      args: {
        office_id: { type: GraphQLID }, // GraphQL expects office_id
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM offices WHERE office_id = $1 RETURNING *`;
        const values = [args.office_id]; // Use args.office_id instead of args.id

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    /*createCase: {
      type: CaseType,
      args: {
        office_id: { type: GraphQLID },
        case_description: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO cases(office_id, case_description) VALUES ($1, $2) RETURNING *`;
        const values = [args.office_id, args.case_description];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },*/

    addchat: {
      type: ChatType,
      args: {
        message: { type: GraphQLString },
        sent_at: { type: GraphQLString },
        senderId: { type: GraphQLID },
        officeId: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `
        INSERT INTO chats (message, sent_at, sender_id, office_id)
        VALUES ( $1, $2, $3, $4)
        RETURNING *
      `;
        const values = [
          args.message,
          args.sent_at,
          args.senderId,
          args.officeId,
        ];
        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => {
            throw new Error("Error adding office: " + err.message);
          });
      },
    },

    createCase: {
      type: CaseType,
      args: {
        office_id: { type: GraphQLID },
        case_description: { type: GraphQLString },
        customer_id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        return db
          .tx(async (t) => {
            // Step 1: Insert into the 'cases' table and get the new case_id
            const insertCaseQuery = `
            INSERT INTO cases(office_id, case_description) 
            VALUES ($1, $2) 
            RETURNING id, office_id, case_description`;
            const caseValues = [args.office_id, args.case_description];
            const caseResult = await t.one(insertCaseQuery, caseValues);

            // Step 2: Insert into the 'case_of_customers' table using the returned case_id
            const insertCaseOfCustomersQuery = `
            INSERT INTO case_of_customers(case_id, customer_id, office_id)
            VALUES ($1, $2, $3) 
            RETURNING *`;
            const caseOfCustomersValues = [
              caseResult.id,
              args.customer_id,
              args.office_id,
            ];
            const caseOfCustomersResult = await t.one(
              insertCaseOfCustomersQuery,
              caseOfCustomersValues
            );

            // Combine the results if needed, or just return one of them
            return {
              ...caseResult,
              customer_id: caseOfCustomersResult.customer_id,
            };
          })
          .catch((err) => {
            console.error("Error in createCase resolver:", err);
            throw new Error("Error creating case");
          });
      },
    },
  },
});

exports.mutation = RootMutation;

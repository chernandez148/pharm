import './EmployeeForm.css'
import { Employee, EmployeeRole, EmployeeValues } from "../../types/employees";
import { usePostMutation } from "../../hooks/usePostMutation";
import { usePatchMutation } from "../../hooks/usePatchMutation";
import { useFetchByID } from "../../hooks/useFetchByID";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import postEmployee from "../../services/employees/postEmployee";
import fetchEmployeeByID from "../../services/employees/getEmployeeByID";
import patchEmployeeByID from "../../services/employees/patchEmployeeByID";
import { useParams } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// Validation schema
const employeeSchema = (isEditMode: boolean) => 
  Yup.object().shape({
    first_name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    role: Yup.string()
      .oneOf(Object.values(EmployeeRole), 'Invalid role')
      .required("Required"),
    password: isEditMode 
      ? Yup.string().notRequired() 
      : Yup.string().required("Required"),
  });

function EmployeeForm() {
  const accessToken = useSelector(
    (state: RootState) => state.accessToken.accessToken
  );
  const { user_id } = useParams<{ user_id: string }>();
  const userID = user_id ? Number(user_id) : null;
  const isEditMode = !!userID;

  const {
    data: userData,
    isLoading,
    isError,
  } = useFetchByID({
    queryKey: "user",
    queryFn: fetchEmployeeByID,
    id: userID,
  });

  const postMutation = usePostMutation<Employee, EmployeeValues>(
    ["users"],
    postEmployee
  );
  const patchMutation = usePatchMutation<Employee, EmployeeValues>(
    ["users"],
    (values: EmployeeValues) => patchEmployeeByID(values, accessToken)
  );

  const user = userData?.user || {};

  const handleSubmit = async (values: EmployeeValues) => {
    try {
      if (isEditMode) {
        await patchMutation.mutateAsync(values);
      } else {
        await postMutation.mutateAsync(values);
      }
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading employee data</div>;

  return (
    <div className="EmployeeForm">
      <Formik
        enableReinitialize
        initialValues={{
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "",
          password: "",
        }}
        validationSchema={employeeSchema(isEditMode)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="employee-form">
            <h2>{isEditMode ? "Edit Employee" : "New Employee"}</h2>
            <div className="employee-form-wrapper">
              <fieldset>
                <legend>Employee Info</legend>
                
                <label>First Name</label>
                <Field name="first_name" />
                <ErrorMessage name="first_name" component="div" className="error" />

                <label>Last Name</label>
                <Field name="last_name" />
                <ErrorMessage name="last_name" component="div" className="error" />

                <label>Username</label>
                <Field name="username" />
                <ErrorMessage name="username" component="div" className="error" />

                <label>Email</label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component="div" className="error" />

                <label>Role</label>
                <Field as="select" name="role">
                  {Object.values(EmployeeRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="error" />

                {!isEditMode && (
                  <>
                    <label>Password</label>
                    <Field name="password" type="password" />
                    <ErrorMessage name="password" component="div" className="error" />
                  </>
                )}
              </fieldset>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                  ? "Update Employee"
                  : "Add Employee"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EmployeeForm;
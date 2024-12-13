# Note Manager

Note Manager is an application designed to efficiently manage notes and categories. It allows you to create, edit, and delete notes, filter them by categories, and easily manage categories.

## Technologies Used

### Frontend:

- **Next.js**
- **TypeScript**
- **Material UI**
- **Zustand**

### Backend:

- **Express.js**
- **Node.js**
- **MongoDB Atlas**
- **JavaScript**

## Prerequisites 
Make sure you have the following installed: 
- Node.js (recommended version: 14.x or higher)
- Yarn (package manager)
## Installation and Setup
  Follow these steps to install and set up the project:
  
1. Clone the repository:
   - ```bash git clone https://github.com/Vctorqui/full_stack_exercise.git ```
   - ```bash cd full_stack_exercise ```

2. Ensure the `start-app.sh` script has execution permissions:
   ```bash chmod +x start-app.sh ```
   
3. Run the start script to install dependencies and start the servers:
   - ```bash ./start-app.sh ```

## Main Features

- Create, edit, and delete notes.
- Filter notes by category.
- Create, add, and delete categories.
- Intuitive interface and responsive design.

## API Reference

### Notes

#### Get all notes

- **Method:** GET
- **Endpoint:** `/api/notes`
- **Description:** Returns a list of all notes.

#### Create a note

- **Method:** POST
- **Endpoint:** `/api/notes`
- **Description:** Creates a new note.
- **Required Body:**
  ```json
  {
    "title": "string",
    "content": "string",
    "categories": []
  }
  ```
  | Parameter    | Type     | Description                               |
  | :----------- | :------- | :---------------------------------------- |
  | `title`      | `string` | **Required**. Title of the note.          |
  | `content`    | `string` | **Required**. Content of the note.        |
  | `categories` | `array` | **Optional**. ID of the related category. |

#### Update a note

- **Method:** PUT
- **Endpoint:** `/api/notes/:id`
- **Description:** Updates an existing note.
- **Requirements:**
  - **ID:** Required in the URL.
  - **Body:** Required.
  ```json
  {
    "title": "string",
    "content": "string",
    "categories": []
  }
  ```
  | Parameter    | Type     | Description                                |
  | :----------- | :------- | :----------------------------------------- |
  | `_id`         | `string` | **Required**. ID of the note to update.    |
  | `title`      | `string` | **Optional**. Updated title of the note.   |
  | `content`    | `string` | **Optional**. Updated content of the note. |
  | `categories` | `array` | **Optional**. Updated category ID.         |

#### Delete a note

- **Method:** DELETE
- **Endpoint:** `/api/notes/:id`
- **Description:** Deletes a note.
- **Requirements:**
- **ID:** Required in the URL.

  | Parameter | Type     | Description                             |
  | :-------- | :------- | :-------------------------------------- |
  | `_id`      | `string` | **Required**. ID of the note to delete. |

### Categories

#### Get all categories

- **Method:** GET
- **Endpoint:** `/api/categories`
- **Description:** Returns a list of all categories.

#### Create a category

- **Method:** POST
- **Endpoint:** `/api/categories`
- **Description:** Creates a new category.
- **Required Body:**
  ```json
  {
    "name": "string",
    "color": "string"
  }
  ```
  | Parameter | Type     | Description                         |
  | :-------- | :------- | :---------------------------------- |
  | `name`    | `string` | **Required**. Name of the category. |
  | `color`    | `string` | **Required**. Color of the category. |

#### Delete a category

- **Method:** DELETE
- **Endpoint:** `/api/categories/:id`
- **Description:** Deletes a category.
- **Requirements:**
- **ID:** Required in the URL.

  | Parameter | Type     | Description                                 |
  | :-------- | :------- | :------------------------------------------ |
  | `_id`      | `string` | **Required**. ID of the category to delete. |

## Usage / Examples

### Zustand Example: Global State Management for Categories

```typescript
interface CategoryState {
  categories: Category[]
  fetchCategories: () => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
}

export const useStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: [],
      fetchCategories: async () => {
        const categories = await getApiCategories()
        set({ categories })
      },
      deleteCategory: async (categoryId: string) => {
        await deleteApiCategory(categoryId)
        set((state) => ({
          categories: state.categories.filter(
            (category) => category._id !== categoryId
          ),
        }))
      },
    }),
    {
      name: 'category-storage',
    }
  )
)
```

### Material UI Example: Custom Input Component

```typescript
interface validationTypes {
  validate: () => boolean
  msg: string
}

interface FancyInputTypes extends StandardTextFieldProps {
  validation?: validationTypes[]
  onlyNumber?: boolean
  maxLength?: number
  validateSubmit?: boolean
  mb?: number
}

export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

const CustomInput = ({
  label,
  name,
  value,
  variant,
  required,
  validation,
  type,
  multiline,
  helperText,
  onChange,
  maxLength,
  validateSubmit,
  mb,
  ...rest
}: FancyInputTypes) => {
  const [touched, setTouched] = useState(false)

  const isNumber = () => type === 'number'

  const isEmptyString = (str: string) => {
    return str === ''
  }

  const stringIsOnlyDigits = (str: string) => {
    return /^[0-9]+([.])?([0-9]+)?$/.test(str)
  }

  const onChangeCustom = (e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true)
    if (
      isNumber() &&
      !isEmptyString(e.target.value) &&
      !stringIsOnlyDigits(e.target.value)
    )
      return
    if (onChange) onChange(e)
  }

  const getMessageError = () => {
    if (validation) {
      for (const v of validation) {
        if (!v.validate()) return v.msg
      }
      return ''
    }
  }

  const requiredCondition = (touched || validateSubmit) && !value && required
  const showCustomError =
    (touched || validateSubmit) && validation && !!getMessageError()
  const hasError = requiredCondition || showCustomError

  return (
    <>
      <FormControl fullWidth error={hasError}>
        <TextField
          label={label}
          style={mb !== undefined ? { marginBottom: mb } : { marginBottom: 10 }}
          size='small'
          error={hasError}
          helperText={
            requiredCondition
              ? '* Required'
              : showCustomError
              ? getMessageError()
              : helperText ?? ''
          }
          variant={variant ? variant : 'outlined'}
          name={name}
          multiline={multiline}
          value={value}
          onChange={onChangeCustom}
          slotProps={{
            input: {
              className: required ? 'textField-required' : '',
            },
            htmlInput: {
              maxLength: maxLength,
              style: multiline
                ? {
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                    margin: '-8.5px -14px',
                    padding: '8.5px 14px',
                  }
                : {
                    backgroundColor: 'transparent',
                    borderRadius: 4,
                  },
              autoComplete: 'off',
              form: {
                autoComplete: 'off',
              },
            },
          }}
          {...rest}
        />
      </FormControl>
    </>
  )
}

export default CustomInput
```
- Validate inputs and give an error message.

### Next.js Base Services

```typescript
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  const data = await response.json()
  console.log(data)
  return data
}
```

### Example cURL Commands

#### Create a note

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first note",
    "content": "This is the content of my note",
    "categories": ["64a3bc2ef"]
  }'
```

#### Get all notes

```bash
curl -X GET http://localhost:3000/api/notes
```

#### Update a note

```bash
curl -X PUT http://localhost:3000/api/notes/64a3bc2ef \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated note",
    "content": "Updated content",
    "categories": ["64a3bc2ef"]
  }'
```

#### Delete a note

```bash
curl -X DELETE http://localhost:3000/api/notes/64a3bc2ef
```

## Features

- **Note Management:**
  - Create, edit, and delete notes.
  - Filter notes by category.
- **Category Management:**
  - Create new categories.
  - Delete categories.
  - Assign categories to notes.
- **User Interface:**
  - Responsive design for all screen sizes.
  - Intuitive and easy-to-use interface.

## Authors

- **Víctor Quiñones**

---

import * as React from "react"

function EditIcon(props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 16 16"
            fill='white'
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M5 15H1v-4l9.414-9.414a2 2 0 012.828 0l1.172 1.172a2 2 0 010 2.828L5 15zm-1.66-3.512l1.172 1.172 5.904-5.904-1.172-1.172-5.904 5.904zM13 4.172l-1.17 1.17-1.172-1.172L11.828 3 13 4.172z"
            />
        </svg >
    )
}

export default EditIcon

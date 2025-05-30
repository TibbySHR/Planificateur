import React from "react";

const getPath = (name: string, props: any) => {
  switch (name) {
    case "arrowDown":
      return (
        <>
          <defs>
            <style>
              {`.cls-2{fill:none;stroke:${
                props.stroke || "#333"
              };stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px}`}
            </style>
          </defs>
          <g id="Group_5123" transform="translate(.5 .5)">
            <g id="Group_4519" transform="translate(4.125 7.551)">
              <path
                id="Line_624"
                d="M4.875 0L0 4.875"
                className="cls-2"
                transform="translate(4.875)"
              />
              <path id="Line_625" d="M4.875 4.875L0 0" className="cls-2" />
            </g>
          </g>
        </>
      );

    case "arrowRight":
      return (
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-305.000000, -6679.000000)"
            fill={props.fill || "#000000"}
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769"
                id="arrow_right-[#336]"
              ></path>
            </g>
          </g>
        </g>
      );
    case "minus":
      return (
        <>
          <path d="M0 10h24v4h-24z" style={{ fill: props.fill }} />
        </>
      );
    case "plus":
      return (
        <path
          d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"
          style={{ fill: props.fill }}
        />
      );

    case "sun":
      const stroke = props.stroke || "#1C274C";
      return (
        <>
          <circle
            cx="12"
            cy="12"
            r="5"
            fill={stroke}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M12 2V4"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 20V22"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 12L2 12"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M22 12L20 12"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19.7778 4.22266L17.5558 6.25424"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4.22217 4.22266L6.44418 6.25424"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M6.44434 17.5557L4.22211 19.7779"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M19.7778 19.7773L17.5558 17.5551"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      );

    case "snow":
      return (
        <path
          d="M12 3V21M9.99995 4L12 6L14 4M9.99995 20L12 18L14 20M4.23218 7.5L19.8206 16.5M4.11133 9.50885L6.57017 8.85L5.91133 6.39115M18.141 17.6089L17.4821 15.15L19.941 14.4912M19.8205 7.5L4.232 16.5M18.1413 6.39115L17.4825 8.85L19.9413 9.50885M4.11166 14.4911L6.57051 15.15L5.91166 17.6088"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );

    case "leaf":
      return (
        <>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.74425 5.08775C4.74454 5.08767 4.74484 5.08759 4.74515 5.08752C4.73431 5.09125 4.73291 5.09067 4.74425 5.08775ZM5.06197 5.06197C5.30798 5.06007 5.64213 5.08354 6.05778 5.13854C7.00348 5.26366 8.24412 5.53447 9.55392 5.91339C10.8617 6.29172 12.2095 6.7695 13.3722 7.29844C14.558 7.83791 15.4624 8.3913 15.9604 8.88933C17.8533 10.7822 18.1259 13.54 16.8928 15.4786L11.7071 10.2929C11.3166 9.90235 10.6834 9.90235 10.2929 10.2929C9.90236 10.6834 9.90236 11.3166 10.2929 11.7071L15.4786 16.8928C13.54 18.1259 10.7822 17.8533 8.88933 15.9604C8.3913 15.4624 7.83791 14.558 7.29844 13.3722C6.7695 12.2095 6.29172 10.8617 5.91339 9.55392C5.53447 8.24412 5.26366 7.00348 5.13854 6.05778C5.08354 5.64213 5.06007 5.30798 5.06197 5.06197ZM16.9179 18.3321C14.1204 20.3974 10.0823 19.9818 7.47512 17.3746C6.71789 16.6174 6.04514 15.4471 5.47798 14.2004C4.90031 12.9307 4.391 11.4883 3.99218 10.1097C3.59395 8.73319 3.29755 7.39136 3.15582 6.32011C3.08547 5.78846 3.04874 5.29093 3.0662 4.87521C3.07489 4.66821 3.09809 4.4503 3.15117 4.24459C3.19961 4.05683 3.2995 3.77154 3.53552 3.53552C3.77154 3.2995 4.05683 3.19961 4.24459 3.15117C4.4503 3.09809 4.66821 3.07489 4.87521 3.0662C5.29093 3.04874 5.78846 3.08547 6.32011 3.15582C7.39136 3.29755 8.73319 3.59395 10.1097 3.99218C11.4883 4.391 12.9307 4.90031 14.2004 5.47798C15.4471 6.04514 16.6174 6.71789 17.3746 7.47512C19.9818 10.0823 20.3974 14.1204 18.3321 16.9179L20.7071 19.2929C21.0976 19.6834 21.0976 20.3166 20.7071 20.7071C20.3166 21.0976 19.6834 21.0976 19.2929 20.7071L16.9179 18.3321ZM5.08752 4.74516C5.08759 4.74484 5.08767 4.74454 5.08775 4.74425C5.09067 4.73291 5.09125 4.73431 5.08752 4.74516Z"
            fill="#000000"
          />
        </>
      );

    case "trash":
      return (
        <path
          d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
          stroke={props.stroke || "#000000"}
          fill={props.fill || "transparent"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );

    case "calendar":
      return (
        <path
          d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M11 13H13M11 17H13M16 13H18M16 17H18M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
          stroke="#000000"
          fill="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );

    case "cross":
      return (
        <path
          d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
          fill={props.fill || "#000000"}
        />
      );

    case "search":
      return (
        <path
          d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
          stroke={props.stroke || "#000000"}
          fill="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );

    case "exclamation":
      return (
        <path
          d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 "
          stroke="none"
          fillRule="evenodd"
          fill={props.fill || "#000000"}
        ></path>
      );

    case "message_error":
      return (
        <>
          <path
            d="M3 3h18v14H12l-3 3-3-3H3z"
            fill="none"
            stroke={props.stroke || "#000000"}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <line
            x1="9"
            y1="7"
            x2="15"
            y2="13"
            stroke={props.stroke || "#000000"}
            strokeWidth="2"
          />
          <line
            x1="15"
            y1="7"
            x2="9"
            y2="13"
            stroke={props.stroke || "#000000"}
            strokeWidth="2"
          />
        </>
      );

    case "resize":
      return (
        <>
          <path
            className="clr-i-outline clr-i-outline-path-1"
            d="M19,4a1,1,0,0,0,0,2h9.59l-9.25,9.25a1,1,0,1,0,1.41,1.41L30,7.41V17a1,1,0,0,0,2,0V4Z"
          ></path>
          <path
            className="clr-i-outline clr-i-outline-path-2"
            d="M4,19a1,1,0,0,1,2,0v9.59l9.25-9.25a1,1,0,1,1,1.41,1.41L7.41,30H17a1,1,0,0,1,0,2H4Z"
          ></path>
          <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
        </>
      );

    case "info":
      return (
        <>
          <path
            d="M10.75 2.44995C11.45 1.85995 12.58 1.85995 13.26 2.44995L14.84 3.79995C15.14 4.04995 15.71 4.25995 16.11 4.25995H17.81C18.87 4.25995 19.74 5.12995 19.74 6.18995V7.88995C19.74 8.28995 19.95 8.84995 20.2 9.14995L21.55 10.7299C22.14 11.4299 22.14 12.5599 21.55 13.2399L20.2 14.8199C19.95 15.1199 19.74 15.6799 19.74 16.0799V17.7799C19.74 18.8399 18.87 19.7099 17.81 19.7099H16.11C15.71 19.7099 15.15 19.9199 14.85 20.1699L13.27 21.5199C12.57 22.1099 11.44 22.1099 10.76 21.5199L9.18001 20.1699C8.88001 19.9199 8.31 19.7099 7.92 19.7099H6.17C5.11 19.7099 4.24 18.8399 4.24 17.7799V16.0699C4.24 15.6799 4.04 15.1099 3.79 14.8199L2.44 13.2299C1.86 12.5399 1.86 11.4199 2.44 10.7299L3.79 9.13995C4.04 8.83995 4.24 8.27995 4.24 7.88995V6.19995C4.24 5.13995 5.11 4.26995 6.17 4.26995H7.9C8.3 4.26995 8.86 4.05995 9.16 3.80995L10.75 2.44995Z"
            stroke="#292D32"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="white"
          />
          <path
            d="M12 8.13V12.96"
            stroke="#292D32"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M11.9945 16H12.0035"
            stroke="#292D32"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </>
      );

    case "share":
      return (
        <>
          <path
            d="M9 12C9 13.3807 7.88071 14.5 6.5 14.5C5.11929 14.5 4 13.3807 4 12C4 10.6193 5.11929 9.5 6.5 9.5C7.88071 9.5 9 10.6193 9 12Z"
            stroke="#1C274C"
            stroke-width="1.5"
            fill="#fff"
          />
          <path
            d="M14 6.5L9 10"
            stroke="#1C274C"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M14 17.5L9 14"
            stroke="#1C274C"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M19 18.5C19 19.8807 17.8807 21 16.5 21C15.1193 21 14 19.8807 14 18.5C14 17.1193 15.1193 16 16.5 16C17.8807 16 19 17.1193 19 18.5Z"
            stroke={"#1C274C"}
            stroke-width="1.5"
            fill="#fff"
          />
          <path
            d="M19 5.5C19 6.88071 17.8807 8 16.5 8C15.1193 8 14 6.88071 14 5.5C14 4.11929 15.1193 3 16.5 3C17.8807 3 19 4.11929 19 5.5Z"
            stroke="#1C274C"
            stroke-width="1.5"
            fill="#fff"
          />
        </>
      );
    case "copy":
      return (
        <>
          <path
            d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
            stroke={props.stroke || "#1C274C"}
            stroke-width="1.5"
            fill="transparent"
          />
          <path
            d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
            stroke={props.stroke || "#1C274C"}
            stroke-width="1.5"
            fill="transparent"
          />
        </>
      );

    case "export":
      return (
        <>
          <path
            d="M12 14L11.6464 14.3536L12 14.7071L12.3536 14.3536L12 14ZM12.5 5C12.5 4.72386 12.2761 4.5 12 4.5C11.7239 4.5 11.5 4.72386 11.5 5L12.5 5ZM6.64645 9.35355L11.6464 14.3536L12.3536 13.6464L7.35355 8.64645L6.64645 9.35355ZM12.3536 14.3536L17.3536 9.35355L16.6464 8.64645L11.6464 13.6464L12.3536 14.3536ZM12.5 14L12.5 5L11.5 5L11.5 14L12.5 14Z"
            fill={props.fill || "#222222"}
          />
          <path
            d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16"
            stroke={props.stroke || "#222222"}
            fill="transparent"
          />
        </>
      );

    case "filter":
      return (
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
          fill="#000000"
        />
      );

    default:
      return <path />;
  }
};

const SVGIcon = ({
  name = "",
  style = {},
  fill = "",
  viewBox = "",
  width = "100%",
  className = "",
  height = "100%",
  id = "",
  stroke = "",
  opacity = "",
  onClick = () => {},
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox || "0 0 25 25"}
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id={id}
    onClick={onClick}
  >
    {getPath(name, { fill, stroke, opacity })}
  </svg>
);

export default SVGIcon;

import React, { useContext } from "react";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";
import { t } from "i18next";
import { SchoolContext } from "../../store/contexts/schoolContext";
import UserForm from "../UserForm/UserForm";
import { FindSegmentsIdsFromBlocks } from "../../store/helpers/courseSelectionHelpers";
import IconButton from "../IconButton/IconButton";

const ExportButton = () => {
  const schoolContext = useContext(SchoolContext);
  const CScontext = useContext(CourseSelectionContext);

  let segments: string[] = [];
  let defaultSegments: string[] = [];

  if (CScontext.program) {
    defaultSegments = FindSegmentsIdsFromBlocks(
      CScontext.program.segments,
      CScontext.semesters.flatMap((s) => s.courses.map((c) => c.blockId || ""))
    );
    segments = CScontext.program.segments.map((s) => s.id);
  }

  // const formFields: FormField[] = [
  //   {
  //     id: "exported_file_name",
  //     label: "name!!",
  //     value: fileName,
  //     onChange: (value: string) => {
  //       console.log("got the changed value in export :", value);
  //       setFileName(value);
  //     },
  //     type: FormFieldType.Text,
  //   },
  // ];
  // <Form fields={formFields} />

  //To-Do move this function to a better place later
  function download(filename: string, text: string) {
    var link = document.createElement("a");
    if (link) {
      link.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      link.setAttribute("download", filename);
      link.click();
    }
  }

  const exportHandler = (
    name: string = "",
    segmentsIncluded: string[] = []
  ) => {
    let fileContent = `Cliquez sur le lien suivant pour accéder aux horaires et à la sélection de cours de "${name}":\n\n${window.location.href}\n\n`;
    if (segmentsIncluded.length > 0)
      fileContent += `Les segments inclus dans ce calendrier sont les suivants :\n${segmentsIncluded.join(
        "\n"
      )}\n`;

    download(name, fileContent);
  };

  const form = (
    <UserForm
      options={segments}
      defaultOptions={defaultSegments}
      onSubmit={(name, selectedOptions) => {
        exportHandler(name, selectedOptions);
        schoolContext.togglePopUp(false);
      }}
    />
  );

  return (
    <>
      <IconButton
        SVGIconProps={{
          name: "export",
          viewBox: "0 0 24 24",
          width: "27",
          height: "27",
          stroke: "#29263d",
          fill: "#29263d",
        }}
        onClick={() => schoolContext.togglePopUp(true, form)}
        tooltip={t("export")}
        className="semester_toolbar__button"
      />
    </>
  );
};

export default ExportButton;

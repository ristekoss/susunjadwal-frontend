import React, { useEffect, useRef } from "react";
import { useMixpanel } from "hooks/useMixpanel";
import { Flex } from "@chakra-ui/react";
import FACULTIES from "utils/faculty-base-additional-info.json";
import { useForm } from "react-hook-form";
import { CustomSelect } from "components/CustomSelect";

function SelectMajor({ theme, isMobile, setMajorSelected, show }) {
  const { register, watch } = useForm();

  const selectedFaculty = watch("fakultas");
  const selectedMajorName = watch("program_studi");

  const prevFacultyRef = useRef("Pilih Fakultas");
  const prevProdiRef = useRef("Pilih Program Studi");

  const selectedMajor =
    selectedFaculty &&
    selectedMajorName &&
    FACULTIES[selectedFaculty].filter(
      (major) =>
        `${major.study_program.replace(
          / *\([^)]*\) */g,
          "",
        )}, ${major.educational_program.replace(/ *\([^)]*\) */g, "")}` ===
        selectedMajorName,
    );

  if (selectedMajor && selectedMajor[0]) {
    setMajorSelected(selectedMajor[0]);
  }

  useEffect(() => {
    if (selectedFaculty) {
      useMixpanel.track("fakultas_dropdown_change", {
        eventName: "fakultas_dropdown_change",
        eventAction: "change",
        eventCategory: "dropdown",
        fieldName: "fakultas",
        prevValue: prevFacultyRef.current,
        newValue: selectedFaculty,
        screenName: "Buat Jadwal",
        screenOwner: "desktop_web",
        eventLabel: "/susun::dropdown-fakultas-selected",
      });
      prevFacultyRef.current = selectedFaculty;
    }
  }, [selectedFaculty]);

  useEffect(() => {
    if (selectedMajorName) {
      useMixpanel.track("prodi_dropdown_change", {
        eventName: "prodi_dropdown_change",
        eventAction: "change",
        eventCategory: "dropdown",
        fieldName: "prodi",
        prevValue: prevProdiRef.current,
        newValue: selectedMajorName,
        screenName: "Buat Jadwal",
        screenOwner: "desktop_web",
        eventLabel: "/susun::dropdown-prodi-selected",
      });
      prevProdiRef.current = selectedMajorName;
    }
  }, [selectedMajorName]);

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      display={show ? "flex" : "none"}
    >
      <CustomSelect
        name="fakultas"
        label="Fakultas"
        register={register}
        mr={{ base: "0", lg: "7px" }}
        mode={theme}
        isMobile={isMobile}
      >
        {Object.keys(FACULTIES).map((faculty) => (
          <option
            key={faculty}
            value={faculty}
            style={{ textTransform: "capitalize" }}
          >
            {faculty.charAt(0) + faculty.toLowerCase().slice(1)}
          </option>
        ))}
      </CustomSelect>

      <CustomSelect
        name="program_studi"
        label="Program Studi"
        register={register}
        disabled={!selectedFaculty}
        ml={{ base: "0", lg: "7px" }}
        mode={theme}
        isMobile={isMobile}
      >
        {selectedFaculty &&
          FACULTIES[selectedFaculty].map((prodi) => (
            <option key={prodi.kd_org}>{`${prodi.study_program.replace(
              / *\([^)]*\) */g,
              "",
            )}, ${prodi.educational_program.replace(
              / *\([^)]*\) */g,
              "",
            )}`}</option>
          ))}
      </CustomSelect>
    </Flex>
  );
}
export default SelectMajor;

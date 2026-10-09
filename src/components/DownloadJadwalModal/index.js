import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

import Schedule from "containers/ViewSchedule/Schedule";
import DownloadRef from "containers/ViewSchedule/DownloadRef";
import downloadVisualisasiImg from "assets/download-visualisasi.svg";
import downloadDaftarImg from "assets/download-daftar.svg";
import downloadComboImg from "assets/download-visualisasi-daftar.svg";

const PALETTE_COLORS = [
  "#5038BC",
  "#FFB700",
  "#FFAC52",
  "#FF50F6",
  "#33D1DA",
  "#FF2E81",
  "#FFF126",
];

function DownloadJadwalModal({
  isOpen,
  onClose,
  schedule,
  formattedSchedule,
  scheduleName = "Jadwal",
}) {
  const theme = useColorModeValue("light", "dark");
  const [viewOption, setViewOption] = useState("visualisasi"); // 'visualisasi' | 'daftar' | 'visualisasi-daftar'
  const [fileFormat, setFileFormat] = useState("PNG"); // 'PNG' | 'JPG' | 'PDF'
  const [colorMap, setColorMap] = useState({});
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const exportRef = useRef(null);

  // Extract unique course names
  const courseNames = useMemo(() => {
    if (!schedule || !schedule.schedule_items) return [];
    const names = new Set();
    schedule.schedule_items.forEach((item) => {
      const cName = item.course_name || item.name;
      if (cName) names.add(cName);
    });
    return Array.from(names);
  }, [schedule]);

  const handleColorChange = (course, color) => {
    setColorMap((prev) => ({
      ...prev,
      [course]: color,
    }));
  };

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const element = exportRef.current.querySelector("#download-schedule");
      if (!element) {
        setIsDownloading(false);
        return;
      }

      const fileName = scheduleName ? `${scheduleName}` : "Jadwal";

      if (fileFormat === "PNG") {
        const dataUrl = await htmlToImage.toPng(element, {
          backgroundColor: theme === "light" ? "#FFFFFF" : "#2C2C2C",
        });
        const link = document.createElement("a");
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        link.click();
      } else if (fileFormat === "JPG") {
        const dataUrl = await htmlToImage.toJpeg(element, {
          quality: 0.95,
          backgroundColor: theme === "light" ? "#FFFFFF" : "#2C2C2C",
        });
        const link = document.createElement("a");
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        link.click();
      } else if (fileFormat === "PDF") {
        const dataUrl = await htmlToImage.toJpeg(element, {
          quality: 0.95,
          backgroundColor: theme === "light" ? "#FFFFFF" : "#2C2C2C",
        });

        const img = new window.Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const imgWidth = img.width;
        const imgHeight = img.height;

        const pdf = new jsPDF({
          orientation: imgWidth > imgHeight ? "landscape" : "portrait",
          unit: "px",
          format: [imgWidth, imgHeight],
        });

        pdf.addImage(dataUrl, "JPEG", 0, 0, imgWidth, imgHeight);
        pdf.save(`${fileName}.pdf`);
      }

      onClose();
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="6xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
      <StyledModalContent mode={theme}>
        <ModalBody p="0">
          <ModalWrapper>
            {/* Left Column: Settings */}
            <LeftSection mode={theme}>
              <ModalTitle mode={theme}>Unduh Jadwal</ModalTitle>

              {/* Tampilan */}
              <SectionBox>
                <SectionHeader mode={theme}>Tampilan</SectionHeader>
                <OptionsContainer>
                  {/* Option 1: Visualisasi */}
                  <OptionCard
                    mode={theme}
                    selected={viewOption === "visualisasi"}
                    onClick={() => setViewOption("visualisasi")}
                  >
                    <RadioRow>
                      <RadioCircle selected={viewOption === "visualisasi"} />
                      <OptionLabel mode={theme}>Visualisasi Jadwal</OptionLabel>
                    </RadioRow>
                    <Image
                      src={downloadVisualisasiImg}
                      alt="visualisasi"
                      w="100%"
                      maxH="75px"
                      borderRadius="4px"
                    />
                  </OptionCard>

                  {/* Option 2: Daftar */}
                  <OptionCard
                    mode={theme}
                    selected={viewOption === "daftar"}
                    onClick={() => setViewOption("daftar")}
                  >
                    <RadioRow>
                      <RadioCircle selected={viewOption === "daftar"} />
                      <OptionLabel mode={theme}>Daftar Jadwal</OptionLabel>
                    </RadioRow>
                    <Image
                      src={downloadDaftarImg}
                      alt="daftar"
                      w="100%"
                      maxH="75px"
                      borderRadius="4px"
                    />
                  </OptionCard>

                  {/* Option 3: Combo */}
                  <OptionCard
                    mode={theme}
                    selected={viewOption === "visualisasi-daftar"}
                    onClick={() => setViewOption("visualisasi-daftar")}
                  >
                    <RadioRow>
                      <RadioCircle
                        selected={viewOption === "visualisasi-daftar"}
                      />
                      <OptionLabel mode={theme}>
                        Visualisasi + Daftar
                      </OptionLabel>
                    </RadioRow>
                    <Image
                      src={downloadComboImg}
                      alt="visualisasi dan daftar"
                      w="100%"
                      maxH="110px"
                      borderRadius="4px"
                    />
                  </OptionCard>
                </OptionsContainer>
              </SectionBox>

              {/* Format File */}
              <SectionBox>
                <SectionHeader mode={theme}>Format File</SectionHeader>
                <TabsContainer mode={theme}>
                  {["PNG", "JPG", "PDF"].map((fmt) => (
                    <TabItem
                      key={fmt}
                      mode={theme}
                      active={fileFormat === fmt}
                      onClick={() => setFileFormat(fmt)}
                    >
                      {fmt}
                    </TabItem>
                  ))}
                </TabsContainer>
              </SectionBox>

              {/* Warna Jadwal */}
              <SectionBox>
                <SectionHeader mode={theme}>Warna Jadwal</SectionHeader>
                <ColorListContainer mode={theme}>
                  {courseNames.length === 0 ? (
                    <EmptyText mode={theme}>Tidak ada mata kuliah</EmptyText>
                  ) : (
                    courseNames.map((cName, idx) => {
                      const curColor = colorMap[cName] || PALETTE_COLORS[0];
                      const isOpenAcc =
                        openAccordion === cName ||
                        (openAccordion === null && idx === 0);

                      return (
                        <ColorRowWrapper key={cName}>
                          <ColorRowHeader
                            onClick={() =>
                              setOpenAccordion(isOpenAcc ? "" : cName)
                            }
                          >
                            <CourseLeft>
                              <ColorSquare bg={curColor} />
                              <CourseNameText mode={theme}>
                                {cName}
                              </CourseNameText>
                            </CourseLeft>
                            {isOpenAcc ? (
                              <ChevronUpIcon w={5} h={5} color="#737373" />
                            ) : (
                              <ChevronDownIcon w={5} h={5} color="#737373" />
                            )}
                          </ColorRowHeader>

                          {isOpenAcc && (
                            <PalettePickerRow>
                              {PALETTE_COLORS.map((hex) => {
                                const isSelected = curColor === hex;
                                return (
                                  <PaletteCircle
                                    key={hex}
                                    bg={hex}
                                    selected={isSelected}
                                    onClick={() =>
                                      handleColorChange(cName, hex)
                                    }
                                  />
                                );
                              })}
                            </PalettePickerRow>
                          )}
                          {idx < courseNames.length - 1 && (
                            <RowDivider mode={theme} />
                          )}
                        </ColorRowWrapper>
                      );
                    })
                  )}
                </ColorListContainer>
              </SectionBox>
            </LeftSection>

            {/* Right Column: Live Preview */}
            <RightSection mode={theme}>
              <PreviewOuterBox mode={theme}>
                <PreviewInnerBox mode={theme}>
                  {viewOption === "visualisasi" && (
                    <PreviewScrollContent>
                      <Schedule
                        width="100%"
                        pxPerMinute={0.7}
                        schedule={schedule}
                        startHour={7}
                        endHour={21}
                        showHeader
                        showLabel
                        showRoom
                        forceDesktopLayout
                        colorMap={colorMap}
                      />
                    </PreviewScrollContent>
                  )}

                  {viewOption === "daftar" && (
                    <PreviewListScroll mode={theme}>
                      <ListTablePreview mode={theme}>
                        <thead>
                          <tr>
                            <th>Nama Kelas</th>
                            <th>Waktu</th>
                            <th>Ruang</th>
                            <th>SKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(formattedSchedule || {}).map((sName) => {
                            const cColor =
                              colorMap[formattedSchedule[sName].name] ||
                              "#5038BC";
                            return (
                              <tr key={sName}>
                                <td>
                                  <FlexName>
                                    <ColorSquareSmall bg={cColor} />
                                    <span>{formattedSchedule[sName].name}</span>
                                  </FlexName>
                                </td>
                                <td>
                                  {formattedSchedule[sName].time.map((t, i) => (
                                    <div key={i}>
                                      {t.day}, {t.start} - {t.end}
                                    </div>
                                  ))}
                                </td>
                                <td>
                                  {formattedSchedule[sName].time.map((t, i) => (
                                    <div key={i}>{t.room}</div>
                                  ))}
                                </td>
                                <td>{formattedSchedule[sName].sks}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </ListTablePreview>
                    </PreviewListScroll>
                  )}

                  {viewOption === "visualisasi-daftar" && (
                    <PreviewScrollContent>
                      <Schedule
                        width="100%"
                        pxPerMinute={0.7}
                        schedule={schedule}
                        startHour={7}
                        endHour={21}
                        showHeader
                        showLabel
                        showRoom
                        forceDesktopLayout
                        colorMap={colorMap}
                      />
                      <ListTablePreview
                        mode={theme}
                        style={{ marginTop: "24px" }}
                      >
                        <thead>
                          <tr>
                            <th>Nama Kelas</th>
                            <th>Waktu</th>
                            <th>Ruang</th>
                            <th>SKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(formattedSchedule || {}).map((sName) => {
                            const cColor =
                              colorMap[formattedSchedule[sName].name] ||
                              "#5038BC";
                            return (
                              <tr key={sName}>
                                <td>
                                  <FlexName>
                                    <ColorSquareSmall bg={cColor} />
                                    <span>{formattedSchedule[sName].name}</span>
                                  </FlexName>
                                </td>
                                <td>
                                  {formattedSchedule[sName].time.map((t, i) => (
                                    <div key={i}>
                                      {t.day}, {t.start} - {t.end}
                                    </div>
                                  ))}
                                </td>
                                <td>
                                  {formattedSchedule[sName].time.map((t, i) => (
                                    <div key={i}>{t.room}</div>
                                  ))}
                                </td>
                                <td>{formattedSchedule[sName].sks}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </ListTablePreview>
                    </PreviewScrollContent>
                  )}
                </PreviewInnerBox>
              </PreviewOuterBox>
            </RightSection>
          </ModalWrapper>

          {/* Hidden full-res export container */}
          <div
            style={{
              position: "fixed",
              top: "-99999px",
              left: "-99999px",
              overflow: "hidden",
              width: "1440px",
              pointerEvents: "none",
            }}
            ref={exportRef}
          >
            <DownloadRef
              pxPerMinute={0.9}
              schedule={schedule}
              startHour={7}
              endHour={21}
              showHeader
              showLabel
              showRoom
              formattedSchedule={formattedSchedule}
              layout={viewOption}
              colorMap={colorMap}
            />
          </div>

          {/* Footer Bar */}
          <ModalFooterBar mode={theme}>
            <BatalBtn type="button" onClick={onClose} mode={theme}>
              Batal
            </BatalBtn>
            <UnduhBtn
              type="button"
              disabled={isDownloading}
              onClick={handleDownload}
              mode={theme}
            >
              {isDownloading ? "Mengunduh..." : "Unduh"}
            </UnduhBtn>
          </ModalFooterBar>
        </ModalBody>
      </StyledModalContent>
    </Modal>
  );
}

export default DownloadJadwalModal;

/* Styled Components */
const StyledModalContent = styled(ModalContent)`
  border-radius: 20px !important;
  background-color: ${({ mode }) =>
    mode === "light" ? "#FFFFFF" : "#2C2C2C"} !important;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2) !important;
  max-width: 1200px !important;
  overflow: hidden !important;
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#FFFFFF")};

  @media (max-width: 900px) {
    max-width: 100% !important;
    margin: 0 !important;
    border-radius: 0 !important;
    min-height: 100vh;
  }
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 640px;

  @media (max-width: 900px) {
    flex-direction: column-reverse;
    height: auto;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }
`;

const LeftSection = styled.div`
  flex: 0 0 440px;
  max-width: 440px;
  padding: 32px 28px 24px 36px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9cefc;
    border-radius: 6px;
  }

  @media (max-width: 900px) {
    flex: 1;
    max-width: 100%;
    padding: 20px 16px;
  }
`;

const ModalTitle = styled.h2`
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3em;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#917DEC")};
  margin: 0;
`;

const SectionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.h3`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: ${({ mode }) => (mode === "light" ? "#5038BC" : "#FFFFFF")};
  margin: 0;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OptionCard = styled.div`
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  border: 2px solid
    ${({ selected, mode }) =>
      selected ? "#5038BC" : mode === "light" ? "#E5E5E5" : "#454545"};
  box-shadow: 0px 0.5px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #5038bc;
  }
`;

const RadioRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const RadioCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ selected }) => (selected ? "#5038BC" : "#737373")};
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #5038bc;
    display: ${({ selected }) => (selected ? "block" : "none")};
  }
`;

const OptionLabel = styled.span`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#FFFFFF")};
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px;
  border-radius: 12px;
  gap: 8px;
  background-color: ${({ mode }) => (mode === "light" ? "#F5F5F5" : "#363636")};
`;

const TabItem = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ active }) => (active ? "#E1E5FE" : "transparent")};
  color: ${({ active, mode }) =>
    active ? "#5038BC" : mode === "light" ? "#737373" : "#D4D4D4"};
`;

const ColorListContainer = styled.div`
  border-radius: 8px;
  padding: 14px 18px;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  border: 1px solid ${({ mode }) => (mode === "light" ? "#E5E5E5" : "#454545")};
  box-shadow: 0px 0.5px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColorRowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColorRowHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const CourseLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const ColorSquare = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${({ bg }) => bg};
  flex-shrink: 0;
`;

const CourseNameText = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${({ mode }) => (mode === "light" ? "#000000" : "#FFFFFF")};
`;

const PalettePickerRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding-left: 32px;
`;

const PaletteCircle = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ bg }) => bg};
  border: ${({ selected }) =>
    selected ? "3px solid #5038BC" : "1px solid rgba(0,0,0,0.1)"};
  box-shadow: ${({ selected }) => (selected ? "0 0 0 2px #FFFFFF" : "none")};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.15);
  }
`;

const RowDivider = styled.div`
  height: 1px;
  background-color: ${({ mode }) => (mode === "light" ? "#E3E3E3" : "#404040")};
  width: 100%;
`;

const EmptyText = styled.p`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #737373;
  margin: 0;
`;

/* Right Preview Section */
const RightSection = styled.div`
  flex: 1;
  background-color: ${({ mode }) => (mode === "light" ? "#F2F2F2" : "#1A1A1A")};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 900px) {
    min-height: 260px;
    padding: 16px;
  }
`;

const PreviewOuterBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #5038bc;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.1);
`;

const PreviewInnerBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c9cefc;
    border-radius: 6px;
  }
`;

const PreviewScrollContent = styled.div`
  width: 100%;
  padding: 12px;
`;

const PreviewListScroll = styled.div`
  width: 100%;
  padding: 16px;
`;

const ListTablePreview = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "Poppins", sans-serif;

  th {
    background-color: #5038bc;
    color: #ffffff;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 12px;
    text-align: left;
  }

  td {
    font-size: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid
      ${({ mode }) => (mode === "light" ? "#E5E5E5" : "#404040")};
    color: ${({ mode }) => (mode === "light" ? "#333333" : "#E5E5E5")};
  }

  tr:nth-child(even) td {
    background-color: ${({ mode }) =>
      mode === "light" ? "#F9F9F9" : "#333333"};
  }
`;

const FlexName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorSquareSmall = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${({ bg }) => bg};
  flex-shrink: 0;
`;

/* Footer Bar */
const ModalFooterBar = styled.div`
  height: 80px;
  padding: 0 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid
    ${({ mode }) => (mode === "light" ? "#EAEAEA" : "#363636")};
  background-color: ${({ mode }) => (mode === "light" ? "#FFFFFF" : "#2C2C2C")};

  @media (max-width: 900px) {
    padding: 0 16px;
    height: 70px;
  }
`;

const BatalBtn = styled.button`
  width: 160px;
  height: 48px;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  background-color: transparent;
  color: ${({ mode }) => (mode === "light" ? "#45349F" : "#917DEC")};
  border: 2px solid ${({ mode }) => (mode === "light" ? "#5038BC" : "#917DEC")};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(80, 56, 188, 0.08);
  }

  @media (max-width: 900px) {
    flex: 1;
    width: auto;
  }
`;

const UnduhBtn = styled.button`
  width: 160px;
  height: 48px;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  background-color: #5038bc;
  color: #ffffff;
  border: none;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #432e9f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 900px) {
    flex: 1;
    width: auto;
  }
`;

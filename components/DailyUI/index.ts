import { memo } from "react";
import UIBlock from "./block";
import UIText from "./text";
import UICard from "./card";
import UITextInput from "./inputText";
import UISelect from "./select";

export const Block = memo(UIBlock);
export const Text = memo(UIText);
export const Card = memo(UICard);
export const TextInput = memo(UITextInput);
export const SelectOption = memo(UISelect);

export default { Block, Text, Card, TextInput, SelectOption };

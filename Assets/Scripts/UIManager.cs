using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UIManager : MonoBehaviour
{
    static public UIManager instance;

    [Header("◆ Instances")]
    [SerializeField]
    private GameObject hexHighlighter = null;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }
    
    public void Highlight(Hex hex)
    {
        hexHighlighter.SetActive(true);
        hexHighlighter.transform.position = Hex.HexToSqr(hex.x, hex.y);
    }
    public void Unhighlight()
    {
        hexHighlighter.SetActive(false);
    }
}
